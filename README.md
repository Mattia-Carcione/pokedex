# PokéGen

Applicazione Vue 3 + Vite che esplora i Pokémon per generazione tramite PokeAPI, con fallback a dati mock per ambienti offline/CI. Implementa Clean Architecture con separazione netta tra layers, Dependency Injection e pattern repository.

NB: il progetto è volutamente over ingegnerizzato, poiché usato a scopo didattico per apprendere l'architettura clean.

## Caratteristiche
- Navigazione per generazione (`/generation/:id`) con elenco ordinato di Pokémon.
- Pagina dettaglio Pokémon (`/pokemon/:name`) **in sviluppo**: controller e mapper sono pronti, l'UI è ancora in costruzione.
- Stato centralizzato con Pinia e controller/use-case che orchestrano repository e store.
- Client HTTP Axios con retry configurabile, exponential backoff con jitter e cache IndexedDB.
- Mock data locali in `assets/mock_data` utilizzati in modalità development.
- Dependency Injection tramite `AppContainer` e container feature-specific (PokéGen, Blob) per la gestione delle dipendenze.
- Sprite ufficiali scaricati come Blob tramite controller dedicato, con lazy loading via Intersection Observer, skeleton e fallback SVG per artwork mancanti.
- Composable `useIntersectionObserver` per ottimizzare il caricamento delle immagini (lazy load).

## Stack tecnico
- **Frontend**: Vue 3, Vite, Vue Router, Pinia
- **HTTP Client**: Axios con interceptor personalizzati (retry, cache)
- **Storage**: IndexedDB per cache delle risposte HTTP (90 giorni TTL) + Memory Cache in-app con TTL configurabile tramite `fetchWithMemoryCache`
- **Styling**: Tailwind 4
- **Testing**: Vitest + @vue/test-utils
- **TypeScript**: Supporto completo con tsconfig

## Architettura (Clean Architecture)

### Core Layer (`src/core/`)
Contiene le regole di business indipendenti dal framework:
- `contracts/`: Interfacce per application, data, infrastructure e presentation
  - `IUseCaseBase`, `IRepository`, `IDataSource`, `IHttpClient`, `ILogger`, `IMapper`
- `domain/`: Entità di dominio (`Result<T, E>`)
- `enums/`: Enum condivisi (`ApplicationErrorCode`)
- `errors/`: Errori applicativi custom (`NotFoundError`, `MappingError`, `UnauthorizedError`)
- `types/`: Tipi comuni (`Base`, `NamedResource`, `Names`)
- `utils/`: Utility pure (`MathHelper`, `delay`)

### Infrastructure Layer (`src/infrastructure/`)
Implementazioni concrete delle interfacce core:
- `cache/`: Gestione cache con:
  - `CacheDb` e `CacheKeyFactory` per IndexedDB (90 giorni TTL)
  - `CacheHelper` con `fetchWithMemoryCache` per cache in-app (default 1h TTL, configurabile)
  - Tipi: `CachedItem<T>`, `CacheMap<T>`, `CachedResponse`, `CacheRequestConfig`
- `http/`: Client HTTP Axios con:
  - `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptor (retry, cache)
  - `config/`: Configurazioni di default per retry e jitter
  - `enums/`: Enum per errori HTTP e retry strategies
  - `mappers/`: `HttpErrorMapper` per normalizzare errori HTTP
  - `utils/`: `Jitter`, `Retry` per strategie di backoff
- `logger/`: `Logger` con livelli (info, warn, error, debug)

### Application Layer (`src/app/`)
Bootstrap e configurazione dell'applicazione:
- `di/`: **Dependency Injection** centralizzato con `AppContainer` (root) e `PokegenContainer` (feature). Usa `FactoryHelper` generico per istanziare classi in base all'ambiente (prod/dev)
- `routing/`: Configurazione Vue Router con `AppRouteName` enum
- `presentation/`: Layout globali (Hero, Navbar) e ViewModel
- `styles/`: CSS globali e variabili Tailwind
- `EnvironmentEnum`: Enum per ambienti (DEVELOPMENT, PRODUCTION, TESTING)

### Modules Layer (`src/modules/pokegen/`)
Feature PokéGen organizzata in sotto-layer:

#### Domain (`domain/`)
- `entities/`: `Generation`, `Pokemon` (entità di business con metodi helper)
- `repositories/`: Interfacce repository (`IGenerationRepository`, `IPokemonRepository`)
- `usecases/`: Interfacce use case (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`)

#### Application (`application/`)
- `mappers/`: `GenerationMapper`, `PokemonMapper` (DTO → Domain)
- `usecases/`: Implementazioni use case (`GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`)

#### Data (`data/`)
- `datasources/`: 
  - `GenerationDataSource`, `PokemonDataSource`, `PokemonSpeciesDataSource`, `PokeApiResponseDataSource` (HTTP)
  - Versioni mock per ogni datasource
- `factories/`: Factory per creare datasource in base all'environment
- `models/`: DTO e tipi aggregati (`GenerationDTO`, `PokemonDTO`, `PokemonSpeciesDTO`, `PokemonAggregateData`)
- `repositories/`: Implementazioni repository con facade per datasource e mapper
- `enums/`: `EndpointApi` per URL degli endpoint
- `types/`: Tipi specifici del data layer

#### Presentation (`presentation/`)
- `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrano use case e store)
- `store/`: Store Pinia (`UseGenerationStore`, `UsePokegenStore`)
- `mappers/`: `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
- `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
- `components/`: Componenti Vue (`Card`, `BadgeType`, `Skeleton`)
- `views/`: Viste principali (`HomeView`, `DetailView`)
- `enums/`: `TypeRequestEnum` per discriminare tipo di richiesta
- `factories/`: Factory per controller

### Shared Layer (`src/shared/`)
Componenti e logica riutilizzabili (usati trasversalmente da più feature):
- `application/`: Use case condivisi (`GetBlobUseCase`)
- `domain/`: Interfacce (`IBlobRepository`, `IGetBlobUseCase`)
- `data/`: `BlobDataSource` (API), `BlobMockDataSource` (mock), `BlobRepository`
- `presentation/`:
  - `components/`: Componenti Vue riutilizzati (`404View`, `Loader`, `CustomSection`, `ScrollToTop`)
  - `composables/`: Vue composable (`useIntersectionObserver` per lazy loading ottimizzato)
  - `contorllers/`: `UseBlobController` per orchestrazione recupero sprite/asset
- `factories/`: `BlobContainer` per dependency injection (DataSourceFactory consolidato in AppContainer)

## Rotte
- `/` – Home (redirect a `/generation/1`)
- `/generation/:id` – Lista Pokémon di una generazione specifica
- `/pokemon/:name` – Dettaglio Pokémon (UI in sviluppo, dati già esposti dal controller)
- `/:pathMatch(.*)*` – Pagina 404 personalizzata

## Avvio rapido
**Prerequisiti**: Node 20.19+ o 22.12+

```bash
npm install
npm run dev        # sviluppo (usa mock data)
npm run build      # build produzione (usa PokeAPI)
npm run preview    # anteprima build locale
npm run deploy     # build e deploy su GitHub Pages
```

## Test
```bash
npm test              # esegue test con vitest
npm run test:ui       # interfaccia interattiva vitest
npm run test:coverage # report coverage
```

## Dependency Injection (AppContainer)
Il `AppContainer` + `PokegenContainer` + `BlobContainer` inizializzano tutte le dipendenze dell'applicazione:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **PokéGen Factories**: `PokegenDataSourceFactory`, `PokegenRepositoryFactory`, `PokegenControllerFactory`
4. **PokéGen DataSources**: Seleziona datasource (API o mock) in base all'`EnvironmentEnum`
5. **PokéGen Repositories**: `GenerationRepository`, `PokemonRepository` con facade per datasource e mapper
6. **PokéGen Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`
7. **PokéGen Controllers**: `UseGenerationController`, `UsePokemonController`
8. **Blob pipeline**: `DataSourceFactory` (API/mock) → `BlobRepository` → `GetBlobUseCase` → `UseBlobController` per caricare sprite e asset binari

```typescript
// Esempio utilizzo in un componente Vue
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: 'pikachu', req: TypeRequestEnum.DETAIL });
```

## Cache e Retry Strategy
- **Cache IndexedDB**: TTL 90 giorni, chiavi generate da `CacheKeyFactory`
- **Memory Cache**: TTL configurabile (default 1 ora), helper `fetchWithMemoryCache` negli store Pinia
  - `UseGenerationStore`: cache memory per generazioni
  - `UsePokegenStore`: cache memory per Pokémon (home e detail)
- **Retry**: Exponential backoff con jitter (full, equal, decorrelated)
  - 3 tentativi di default con delay iniziale 1000ms
  - Retry su errori transitori (429, 500, 503, 504) e errori di rete
- **Interceptor**: Request (cache read da IndexedDB) e Response (cache write su IndexedDB, retry logic)

## Struttura progetto completa
```
src/
  app/
    di/
      AppContainer.ts                # DI container principale
      pokegen/
        PokegenContainer.ts          # DI container pokegen
    presentation/
      layout/                        # Hero, Navbar
      viewmodels/                    # NavbarViewModel
    routing/
      AppRouteName.ts                # Enum rotte
      routes.ts                      # Configurazione router
    styles/
    const.ts                         # Costanti app
    EnvironmentEnum.ts               # Enum ambienti
  core/
    contracts/                       # Interfacce astratte
    costants/                        # BASE_API_URL
    domain/                          # Result<T, E>
    enums/                           # ApplicationErrorCode
    errors/                          # Custom errors
    types/                           # Tipi comuni
    utils/                           # Utility pure
  infrastructure/
    cache/
      CacheDb.ts                     # Gestione IndexedDB
      CacheKeyFactory.ts             # Generatore chiavi cache
      helpers/                       # CacheHelper con fetchWithMemoryCache
      types/                         # CachedItem, CacheMap, CachedResponse
    http/
      client/axios/                  # AxiosHttpClient, interceptor
      config/                        # HttpConfig
      enums/                         # ErrorTypeEnum, RetryEnum
      mappers/                       # HttpErrorMapper
      utils/                         # Jitter, Retry
    logger/                          # Logger
  modules/
    pokegen/
      application/
        mappers/                     # DTO → Domain
        usecases/                    # Business logic
      data/
        datasources/                 # API, mock e aggregati
        factories/                   # Factory per datasource
        models/                      # DTO e tipi
        repositories/                # Implementazioni repository
        types/                       # Tipi specifici data layer
      domain/
        entities/                    # Generation, Pokemon
        repositories/                # Interfacce repository
        usecases/                    # Interfacce use case
      presentation/
        components/                  # Card, BadgeType, Skeleton
        controllers/                 # Orchestrazione
        factories/                   # Factory controller
        mappers/                     # Domain → ViewModel
        store/                       # Pinia stores
        viewmodels/                  # HomeViewModel, DetailViewModel
        views/                       # HomeView, DetailView
  shared/
    application/
      usecases/                      # GetBlobUseCase
    data/
      datasources/                   # BlobDataSource (API), BlobMockDataSource (mock)
      factories/                     # DataSourceFactory (seleziona API/mock)
      repositories/                  # BlobRepository
    domain/
      repositories/                  # IBlobRepository
      usecases/                      # IGetBlobUseCase
    presentation/
      components/                    # Loader, 404View, CustomSection, ScrollToTop
      composables/                   # useIntersectionObserver per lazy loading
      contorllers/                   # UseBlobController
      viewmodels/                    # ViewModel condivisi
    factories/                       # BlobContainer
assets/
  mock_data/                         # Dati JSON mock
public/
  default_image.svg                  # Immagine default Pokémon
```

## Mock Data vs API
- **Development** (`npm run dev`): Usa mock data da `assets/mock_data/`
- **Production** (`npm run build`): Usa PokeAPI in produzione
- **Testing**: Usa mock data per test deterministici

La selezione avviene automaticamente tramite le factory in base a `EnvironmentEnum`.

## Deploy su GitHub Pages
```bash
npm run deploy
```
Build Vite + deploy automatico su branch `gh-pages` con `404.html` per SPA routing.

## Stato attuale
✅ Sistema di generazioni completo con navigazione  
✅ Lista Pokémon per generazione con card dettagliate  
✅ Cache persistente e retry strategy  
✅ Clean Architecture con DI modulare  
✅ Immagini di fallback SVG per artwork mancanti e sprite caricati via BlobController  
🚧 **Pagina dettaglio Pokémon**: logica dati pronta, UI da completare
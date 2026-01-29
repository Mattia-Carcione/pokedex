# PokéGen

Applicazione Vue 3 + Vite che esplora i Pokémon per generazione tramite PokeAPI, con fallback a dati mock per ambienti offline/CI. Implementa Clean Architecture con separazione netta tra layers, Dependency Injection e pattern repository.

NB: il progetto è volutamente over ingegnerizzato, poiché usato a scopo didattico per apprendere l'architettura clean.

## Caratteristiche
- Navigazione per generazione (`/generation/:id`) con elenco ordinato di Pokémon.
- Pagina dettaglio Pokémon (`/pokemon/:name`) completa con card dedicata, stats, flavor text, size/capture rate e catena evolutiva.
- Ricerca Pokémon con input dedicato e debounce, basata su indice PokeAPI locale e fetch dei dettagli.
- Stato centralizzato con Pinia e controller/use-case che orchestrano repository e store.
- Client HTTP Axios con retry configurabile, exponential backoff con jitter e cache IndexedDB.
- Mock data locali in `assets/mock_data` utilizzati in modalità development (incl. `pokeapi-list.json`).
- Dependency Injection tramite `AppContainer` e container feature-specific (PokéGen, Shared) per la gestione delle dipendenze.
- Sprite ufficiali scaricati come Blob tramite controller dedicato, con lazy loading via Intersection Observer, skeleton e fallback SVG per artwork mancanti.
- Composable `useIntersectionObserver` per ottimizzare il caricamento delle immagini (lazy load).

## Stack tecnico
- **Frontend**: Vue 3, Vite, Vue Router, Pinia
- **HTTP Client**: Axios con interceptor personalizzati (retry, cache)
- **Storage**: IndexedDB per cache delle risposte HTTP (90 giorni TTL) + InMemoryCache in-app con TTL configurabile (via `InMemoryCache.set)
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
- `utils/`: Utility pure e helper:
  - `async/`: Funzioni asincrone (`delay`)
  - `factories/`: `FactoryHelper` per istanziare classi in base all'ambiente
  - `math/`: `MathHelper` per operazioni matematiche
  - `network/`: Utility di rete per connectivity detection e request optimization

### Infrastructure Layer (`src/infrastructure/`)
Implementazioni concrete delle interfacce core:
- `cache/`: `InMemoryCache` (TTL in-app e chiavi univoche)
- `indexedDb/`: Gestione cache persistente con:
  - `CacheDb` e `CacheKeyFactory` per IndexedDB (90 giorni TTL)
  - Tipi: `CacheItem`, `CacheMap`, `CachedResponse`, `CacheRequestConfig`
- `http/`: Client HTTP Axios con:
  - `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptor (retry, cache)
  - `config/`: Configurazioni di default per retry e jitter
  - `enums/`: Enum per errori HTTP e retry strategies
  - `mappers/`: `HttpErrorMapper` per normalizzare errori HTTP
  - `utils/`: `Jitter`, `Retry` per strategie di backoff
- `logger/`: `Logger` con livelli (info, warn, error, debug)

### Application Layer (`src/app/`)
Bootstrap e configurazione dell'applicazione:
- `di/`: **Dependency Injection** centralizzato con `AppContainer` (root) e `PokegenContainer` (feature). Usa `FactoryHelper` generico per istanziare classi in base all'ambiente (prod/dev).
- `routing/`: Configurazione Vue Router con `AppRouteName` enum (Home = '/')
- `presentation/`: Layout globali (Hero, Navbar, Footer) e ViewModel
- `styles/`: CSS globali e variabili Tailwind
- `EnvironmentEnum`: Enum per ambienti (DEVELOPMENT, PRODUCTION, TESTING)

### Modules Layer (`src/modules/pokegen/`)
Feature PokéGen organizzata in sotto-layer:

#### Domain (`domain/`)
- `entities/`: `Generation`, `Pokemon` (entità di business con metodi helper)
- `repositories/`: Interfacce repository (`IGenerationRepository`, `IPokemonRepository`)
- `usecases/`: Interfacce use case (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`)

#### Application (`application/`)
- `mappers/`: 
  - `GenerationMapper`, `PokemonMapper` (DTO → Domain)
  - `utils/`: Utility per mapper (`Traverse` per traversal ricorsivo catena evolutiva)
- `usecases/`: Implementazioni use case (`GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`)

#### Data (`data/`)
- `datasources/`: 
  - `GenerationDataSource`, `PokemonDataSource`, `PokemonSpeciesDataSource`, `PokeApiResponseDataSource` (HTTP)
  - Versioni mock per ogni datasource
- `models/`: DTO e tipi aggregati (`GenerationDTO`, `PokemonDTO`, `PokemonSpeciesDTO`, `PokemonAggregateData`)
- `repositories/`: Implementazioni repository con facade per datasource e mapper
- `enums/`: `EndpointApi` per URL degli endpoint
- `types/`: Tipi specifici del data layer

#### Presentation (`presentation/`)
- `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrano use case e store)
- `store/`: Store Pinia (`UseGenerationStore`, `UsePokegenStore`)
- `mappers/`: 
  - `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
  - `utils/evolution/`: Utility builder (`BuildPokemonVM`, `BuildEvolutionVM`)
- `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
- `components/`: Componenti Vue (`Card`, `BadgeType`, `Skeleton`, `EvolutionChain`)
- `views/`: Viste principali (`HomeView`, `DetailView`)
- `enums/`: `TypeRequestEnum` per discriminare tipo di richiesta
- `routes.ts`: Rotte della feature

### Shared Layer (`src/shared/`)
Componenti e logica riutilizzabili (usati trasversalmente da più feature):
- `application/`: Use case condivisi (`GetBlobUseCase`, `GetPokeApiUseCase`)
- `domain/`: Interfacce (`IBlobRepository`, `IGetBlobUseCase`, `IPokeApiRepository`, `IGetPokeApiUseCase`)
- `data/`: `BlobDataSource` (API), `BlobMockDataSource` (mock), `BlobRepository`, `PokeApiResponseDataSource`, `PokeApiRepository`
- `presentation/`:
  - `components/`: Componenti Vue riutilizzati (`404View`, `Loader`, `CustomSection`, `ScrollToTop`)
  - `composables/`: Vue composable (`useIntersectionObserver` per lazy loading ottimizzato)
  - `controllers/`: `UseBlobController`, `UsePokeApiController` (indice e ricerca PokeAPI)
- `factories/`: `SharedContainer` per dependency injection (Blob + PokeAPI + cache)

## Rotte
- `/` – Home (lista generazioni, redirect da /generation/1)
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
Il `AppContainer` + `PokegenContainer` + `SharedContainer` inizializzano tutte le dipendenze dell'applicazione:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **PokéGen DataSources**: Selezione API/mock via `FactoryHelper.createByEnvHelper`
4. **PokéGen Repositories**: `GenerationRepository`, `PokemonRepository` con facade per datasource e mapper
5. **PokéGen Services**: `NavigationPokemonLoaderService`, `EvolutionSpriteEnricherService`
6. **PokéGen Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`, `GetSearchPokemonUseCase`
7. **PokéGen Controllers**: `UseGenerationController`, `UsePokemonController`
8. **Shared pipeline**: `BlobRepository` + `PokeApiRepository` → `GetBlobUseCase` + `GetPokeApiUseCase` → `UseBlobController` + `UsePokeApiController`

```typescript
// Esempio utilizzo in un componente Vue
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: 'pikachu', req: TypeRequestEnum.DETAIL });
```

## Cache e Retry Strategy
- **Cache IndexedDB**: TTL 90 giorni, chiavi generate da `CacheKeyFactory`
- **InMemory Cache**: TTL configurabile (default 1 ora)
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
      AppContainer.ts                # DI container principale (nota: DEV invertito)
      pokegen/
        PokegenContainer.ts          # DI container pokegen
    presentation/
      layout/                        # Hero, Navbar, Footer
      viewmodels/                    # NavbarViewModel
    routing/
      AppRouteName.ts                # Enum rotte (Home = '/')
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
      InMemoryCache.ts               # Cache in memoria
    indexedDb/
      CacheDb.ts                     # Gestione IndexedDB
      CacheKeyFactory.ts             # Generatore chiavi cache
      types/                         # CacheItem, CacheMap, CachedResponse
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
        mappers/                     # DTO → Domain (+ utils/Traverse)
        usecases/                    # Business logic
      data/
        datasources/                 # API, mock e aggregati
        models/                      # DTO e tipi
        repositories/                # Implementazioni repository
        types/                       # Tipi specifici data layer
      domain/
        entities/                    # Generation, Pokemon
        repositories/                # Interfacce repository
        usecases/                    # Interfacce use case
      presentation/
        components/                  # Card, BadgeType, Skeleton, EvolutionChain
        controllers/                 # Orchestrazione
        mappers/                     # Domain → ViewModel (+ utils/evolution/)
        store/                       # Pinia stores
        viewmodels/                  # HomeViewModel, DetailViewModel
        views/                       # HomeView, DetailView
        routes.ts                    # Rotte della feature
  shared/
    application/
      usecases/                      # GetBlobUseCase, GetPokeApiUseCase
    data/
      datasources/                   # BlobDataSource, PokeApiResponseDataSource (+ mock)
      repositories/                  # BlobRepository, PokeApiRepository
    domain/
      repositories/                  # IBlobRepository, IPokeApiRepository
      usecases/                      # IGetBlobUseCase, IGetPokeApiUseCase
    presentation/
      components/                    # Loader, 404View, CustomSection, ScrollToTop
      composables/                   # useIntersectionObserver per lazy loading
      controllers/                   # UseBlobController, UsePokeApiController
      viewmodels/                    # ViewModel condivisi
    factories/                       # SharedContainer
assets/
  mock_data/                         # Dati JSON mock
public/
  default_image.svg                  # Immagine default Pokémon
```

## Mock Data vs API
- **Development** (`npm run dev`): Usa mock data da `assets/mock_data/`
- **Production** (`npm run build`): Usa PokeAPI in produzione
- **Testing**: Usa mock data per test deterministici

Nota: l'indice completo per la ricerca è in `assets/mock_data/pokeapi-list.json`.

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
✅ **Pagina dettaglio Pokémon** completa (stats, flavor text, size/capture rate, catena evolutiva)

## Ultimi aggiornamenti
- **v1.4.0**: Refactoring cache + ricerca PokeAPI condivisa
  - Spostata la cache persistente in `infrastructure/indexedDb` e introdotta `InMemoryCache`
  - Aggiunti `PokeApiRepository`, `GetPokeApiUseCase` e `UsePokeApiController`
  - Aggiunta ricerca Pokémon con input dedicato (debounce) e lista indicizzata
- **v1.3.0**: Refactoring mapper e utility di evoluzione
  - Estratto `Traverse` da `PokemonMapper` in file separato `mappers/utils/Traverse.ts`
  - Estratto `BuildPokemonVM` e `BuildEvolutionVM` da `PokemonViewMapper` in `presentation/mappers/utils/evolution/`
  - Creato componente `Footer.vue` dedicato per il footer dell'app
  - Corretto route home da 'home' a '/' in `AppRouteName`
  - Estratto `main.js` per montare Footer su elemento dedicato `#footer`
  - Refactored `EvolutionChain.vue` per miglior feedback visuale (messaggio "no evolution")
  - Refactored `PokemonViewMapper.mapEvolutionToVM()` per gestire fallback evoluzione
  - Miglioramento maintainability, testabilità e separazione responsabilità mapper
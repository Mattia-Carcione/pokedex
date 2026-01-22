# PokéGen

Applicazione Vue 3 + Vite che esplora i Pokémon per generazione tramite PokeAPI, con fallback a dati mock per ambienti offline/CI. Implementa Clean Architecture con separazione netta tra layers, Dependency Injection e pattern repository.

## Caratteristiche
- Navigazione per generazione (`/generation/:id`) con elenco ordinato di Pokémon.
- Routing dedicato per il dettaglio (`/pokemon/:name`), attualmente in sviluppo.
- Stato centralizzato con Pinia e controller/use-case che orchestrano repository e store.
- Client HTTP Axios con retry configurabile, exponential backoff con jitter e cache IndexedDB.
- Mock data locali in `assets/mock_data` utilizzati in modalità development.
- Dependency Injection tramite `AppContainer` per gestione delle dipendenze.

## Stack tecnico
- **Frontend**: Vue 3, Vite, Vue Router, Pinia
- **HTTP Client**: Axios con interceptor personalizzati (retry, cache)
- **Storage**: IndexedDB per cache delle risposte HTTP (90 giorni TTL)
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
- `cache/`: Gestione cache IndexedDB con `CacheDb` e `CacheKeyFactory`
- `http/`: Client HTTP Axios con:
  - `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptor (retry, cache)
  - `config/`: Configurazioni di default per retry e jitter
  - `enums/`: Enum per errori HTTP e retry strategies
  - `mappers/`: `HttpErrorMapper` per normalizzare errori HTTP
  - `utils/`: `Jitter`, `Retry` per strategie di backoff
- `logger/`: `Logger` con livelli (info, warn, error, debug)

### Application Layer (`src/app/`)
Bootstrap e configurazione dell'applicazione:
- `di/`: **Dependency Injection** con `AppContainer` (crea e gestisce tutte le dipendenze)
- `routing/`: Configurazione Vue Router con `AppRouteName` enum
- `presentation/`: Layout globali (Hero, Navbar) e ViewModel
- `styles/`: CSS globali e variabili Tailwind
- `EnvironmentEnum`: Enum per ambienti (DEVELOPMENT, PRODUCTION, TESTING)

### Modules Layer (`src/modules/pokegen/`)
Feature PokéGen organizzata in sotto-layer:

#### Domain (`domain/`)
- `entities/`: `Generation`, `Pokemon` (entità di business)
- `repositories/`: Interfacce repository (`IGenerationRepository`, `IPokemonRepository`)
- `usecases/`: Interfacce use case (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`)

#### Application (`application/`)
- `mappers/`: `GenerationMapper`, `PokemonMapper` (DTO → Domain)
- `usecases/`: Implementazioni use case (`GetGenerationUseCase`, `GetPokemonUseCase`)

#### Data (`data/`)
- `datasources/`: `GenerationDataSource`, `PokemonDataSource` (HTTP) e versioni mock
- `factories/`: Factory per creare datasource in base all'environment
- `models/`: DTO e tipi aggregati (`GenerationDTO`, `PokemonDTO`, `PokemonAggregateData`)
- `repositories/`: Implementazioni repository con facade per datasource e mapper
- `enums/`: `EndpointApi` per URL degli endpoint

#### Presentation (`presentation/`)
- `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrano use case e store)
- `store/`: Store Pinia (`UseGenerationStore`, `UsePokegenStore`)
- `mappers/`: `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
- `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
- `components/`: Componenti Vue (`Card`, `BadgeType`, `Skeleton`)
- `views/`: Viste principali (`HomeView`, `DetailView`)
- `enums/`: `TypeRequestEnum` per discriminare tipo di richiesta

### Shared Layer (`src/shared/`)
Componenti e viewmodel riutilizzabili:
- `components/`: `404View`, `Loader`, `CustomSection`, `ScrollToTop`
- `viewmodels/`: `GenerationVM` per dati navbar

## Rotte
- `/` – Home (redirect a `/generation/1`)
- `/generation/:id` – Lista Pokémon di una generazione specifica
- `/pokemon/:name` – Dettaglio Pokémon (in sviluppo)
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
Il `AppContainer` inizializza tutte le dipendenze dell'applicazione:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **Factories**: `GenerationDataSourceFactory`, `PokemonDataSourceFactory`, etc.
4. **DataSources**: Seleziona datasource (API o mock) in base all'`EnvironmentEnum`
5. **Repositories**: `GenerationRepository`, `PokemonRepository` con facade per datasource e mapper
6. **Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`
7. **Controllers**: `UseGenerationController`, `UsePokemonController`

```typescript
// Esempio utilizzo in un componente Vue
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: '1', req: TypeRequestEnum.HOME });
```

## Cache e Retry Strategy
- **Cache**: IndexedDB con TTL 90 giorni, chiavi generate da `CacheKeyFactory`
- **Retry**: Exponential backoff con jitter (full, equal, decorrelated)
  - 3 tentativi di default con delay iniziale 1000ms
  - Retry su errori transitori (429, 500, 503, 504) e errori di rete
- **Interceptor**: Request (cache read) e Response (cache write, retry logic)

## Struttura progetto completa
```
src/
  app/
    di/
      AppContainer.ts           # DI container
    presentation/
      layout/                   # Hero, Navbar
      viewmodels/              # NavbarViewModel
    routing/
      AppRouteName.ts          # Enum rotte
      routes.ts                # Configurazione router
    styles/
    EnvironmentEnum.ts         # Enum ambienti
  core/
    contracts/                 # Interfacce astratte
    costants/                  # BASE_API_URL
    domain/                    # Result<T, E>
    enums/                     # ApplicationErrorCode
    errors/                    # Custom errors
    types/                     # Tipi comuni
    utils/                     # Utility pure
  infrastructure/
    cache/                     # CacheDb, CacheKeyFactory
    http/
      client/axios/            # AxiosHttpClient, interceptor
      config/                  # HttpConfig
      enums/                   # ErrorTypeEnum, RetryEnum
      mappers/                 # HttpErrorMapper
      utils/                   # Jitter, Retry
    logger/                    # Logger
  modules/
    pokegen/
      application/
        mappers/               # DTO → Domain
        usecases/              # Business logic
      data/
        datasources/           # API e mock
        factories/             # Factory per datasource
        models/                # DTO e tipi
        repositories/          # Implementazioni repository
      domain/
        entities/              # Generation, Pokemon
        repositories/          # Interfacce repository
        usecases/              # Interfacce use case
      presentation/
        components/            # Card, BadgeType
        controllers/           # Orchestrazione
        mappers/               # Domain → ViewModel
        store/                 # Pinia stores
        viewmodels/            # HomeViewModel, DetailViewModel
        views/                 # HomeView, DetailView
  shared/
    components/                # 404View, Loader
    viewmodels/                # GenerationVM
assets/
  mock_data/                   # Dati JSON mock
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
✅ Clean Architecture con DI  
🚧 Pagina dettaglio Pokémon (in sviluppo)

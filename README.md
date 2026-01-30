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

# English:

## PokéGen

Vue 3 + Vite application that explores Pokémon by generation via PokeAPI, with fallback to mock data for offline/CI environments. Implements Clean Architecture with a strict separation between layers, Dependency Injection, and the repository pattern.

NB: the project is intentionally over-engineered, as it is used for educational purposes to learn clean architecture.

## Features

* Generation-based navigation (`/generation/:id`) with an ordered list of Pokémon.
* Pokémon detail page (`/pokemon/:name`) complete with a dedicated card, stats, flavor text, size/capture rate, and evolution chain.
* Pokémon search with dedicated input and debounce, based on a local PokeAPI index and fetching of details.
* Centralized state with Pinia and controller/use-case layers that orchestrate repositories and store.
* Axios HTTP client with configurable retry, exponential backoff with jitter, and IndexedDB cache.
* Local mock data in `assets/mock_data` used in development mode (incl. `pokeapi-list.json`).
* Dependency Injection via `AppContainer` and feature-specific containers (PokéGen, Shared) for dependency management.
* Official sprites downloaded as Blobs via a dedicated controller, with lazy loading via Intersection Observer, skeletons, and SVG fallback for missing artwork.
* `useIntersectionObserver` composable to optimize image loading (lazy load).

## Tech stack

* **Frontend**: Vue 3, Vite, Vue Router, Pinia
* **HTTP Client**: Axios with custom interceptors (retry, cache)
* **Storage**: IndexedDB for HTTP response cache (90 days TTL) + in-app InMemoryCache with configurable TTL (via `InMemoryCache.set`)
* **Styling**: Tailwind 4
* **Testing**: Vitest + @vue/test-utils
* **TypeScript**: Full support with tsconfig

## Architecture (Clean Architecture)

### Core Layer (`src/core/`)

Contains framework-agnostic business rules:

* `contracts/`: Interfaces for application, data, infrastructure, and presentation

  * `IUseCaseBase`, `IRepository`, `IDataSource`, `IHttpClient`, `ILogger`, `IMapper`
* `domain/`: Domain entities (`Result<T, E>`)
* `enums/`: Shared enums (`ApplicationErrorCode`)
* `errors/`: Custom application errors (`NotFoundError`, `MappingError`, `UnauthorizedError`)
* `types/`: Common types (`Base`, `NamedResource`, `Names`)
* `utils/`: Pure utilities and helpers:

  * `async/`: Asynchronous functions (`delay`)
  * `factories/`: `FactoryHelper` to instantiate classes based on environment
  * `math/`: `MathHelper` for mathematical operations
  * `network/`: Network utilities for connectivity detection and request optimization

### Infrastructure Layer (`src/infrastructure/`)

Concrete implementations of core interfaces:

* `cache/`: `InMemoryCache` (in-app TTL and unique keys)
* `indexedDb/`: Persistent cache management with:

  * `CacheDb` and `CacheKeyFactory` for IndexedDB (90 days TTL)
  * Types: `CacheItem`, `CacheMap`, `CachedResponse`, `CacheRequestConfig`
* `http/`: Axios HTTP client with:

  * `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptors (retry, cache)
  * `config/`: Default configurations for retry and jitter
  * `enums/`: Enums for HTTP errors and retry strategies
  * `mappers/`: `HttpErrorMapper` to normalize HTTP errors
  * `utils/`: `Jitter`, `Retry` for backoff strategies
* `logger/`: `Logger` with levels (info, warn, error, debug)

### Application Layer (`src/app/`)

Application bootstrap and configuration:

* `di/`: **Dependency Injection** centralized with `AppContainer` (root) and `PokegenContainer` (feature). Uses generic `FactoryHelper` to instantiate classes based on environment (prod/dev).
* `routing/`: Vue Router configuration with `AppRouteName` enum (Home = '/')
* `presentation/`: Global layouts (Hero, Navbar, Footer) and ViewModels
* `styles/`: Global CSS and Tailwind variables
* `EnvironmentEnum`: Enum for environments (DEVELOPMENT, PRODUCTION, TESTING)

### Modules Layer (`src/modules/pokegen/`)

PokéGen feature organized into sub-layers:

#### Domain (`domain/`)

* `entities/`: `Generation`, `Pokemon` (business entities with helper methods)
* `repositories/`: Repository interfaces (`IGenerationRepository`, `IPokemonRepository`)
* `usecases/`: Use case interfaces (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`)

#### Application (`application/`)

* `mappers/`:

  * `GenerationMapper`, `PokemonMapper` (DTO → Domain)
  * `utils/`: Mapper utilities (`Traverse` for recursive traversal of evolution chain)
* `usecases/`: Use case implementations (`GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`)

#### Data (`data/`)

* `datasources/`:

  * `GenerationDataSource`, `PokemonDataSource`, `PokemonSpeciesDataSource`, `PokeApiResponseDataSource` (HTTP)
  * Mock versions for each datasource
* `models/`: DTOs and aggregated types (`GenerationDTO`, `PokemonDTO`, `PokemonSpeciesDTO`, `PokemonAggregateData`)
* `repositories/`: Repository implementations with datasource and mapper facades
* `enums/`: `EndpointApi` for endpoint URLs
* `types/`: Data-layer specific types

#### Presentation (`presentation/`)

* `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrate use cases and store)
* `store/`: Pinia stores (`UseGenerationStore`, `UsePokegenStore`)
* `mappers/`:

  * `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
  * `utils/evolution/`: Utility builders (`BuildPokemonVM`, `BuildEvolutionVM`)
* `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
* `components/`: Vue components (`Card`, `BadgeType`, `Skeleton`, `EvolutionChain`)
* `views/`: Main views (`HomeView`, `DetailView`)
* `enums/`: `TypeRequestEnum` to discriminate request type
* `routes.ts`: Feature routes

### Shared Layer (`src/shared/`)

Reusable components and logic (used across multiple features):

* `application/`: Shared use cases (`GetBlobUseCase`, `GetPokeApiUseCase`)
* `domain/`: Interfaces (`IBlobRepository`, `IGetBlobUseCase`, `IPokeApiRepository`, `IGetPokeApiUseCase`)
* `data/`: `BlobDataSource` (API), `BlobMockDataSource` (mock), `BlobRepository`, `PokeApiResponseDataSource`, `PokeApiRepository`
* `presentation/`:

  * `components/`: Reusable Vue components (`404View`, `Loader`, `CustomSection`, `ScrollToTop`)
  * `composables/`: Vue composable (`useIntersectionObserver` for optimized lazy loading)
  * `controllers/`: `UseBlobController`, `UsePokeApiController` (PokeAPI index and search)
* `factories/`: `SharedContainer` for dependency injection (Blob + PokeAPI + cache)

## Routes

* `/` – Home (generation list, redirect from /generation/1)
* `/generation/:id` – Pokémon list of a specific generation
* `/pokemon/:name` – Pokémon detail (UI under development, data already exposed by the controller)
* `/:pathMatch(.*)*` – Custom 404 page

## Quick start

**Prerequisites**: Node 20.19+ or 22.12+

```bash
npm install
npm run dev        # development (uses mock data)
npm run build      # production build (uses PokeAPI)
npm run preview    # local build preview
npm run deploy     # build and deploy to GitHub Pages
```

## Tests

```bash
npm test              # run tests with vitest
npm run test:ui       # vitest interactive UI
npm run test:coverage # coverage report
```

## Dependency Injection (AppContainer)

The `AppContainer` + `PokegenContainer` + `SharedContainer` initialize all application dependencies:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **PokéGen DataSources**: API/mock selection via `FactoryHelper.createByEnvHelper`
4. **PokéGen Repositories**: `GenerationRepository`, `PokemonRepository` with datasource and mapper facades
5. **PokéGen Services**: `NavigationPokemonLoaderService`, `EvolutionSpriteEnricherService`
6. **PokéGen Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`, `GetSearchPokemonUseCase`
7. **PokéGen Controllers**: `UseGenerationController`, `UsePokemonController`
8. **Shared pipeline**: `BlobRepository` + `PokeApiRepository` → `GetBlobUseCase` + `GetPokeApiUseCase` → `UseBlobController` + `UsePokeApiController`

```typescript
// Example usage in a Vue component
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: 'pikachu', req: TypeRequestEnum.DETAIL });
```

## Cache and Retry Strategy

* **IndexedDB Cache**: 90-day TTL, keys generated by `CacheKeyFactory`
* **InMemory Cache**: Configurable TTL (default 1 hour)

  * `UseGenerationStore`: memory cache for generations
  * `UsePokegenStore`: memory cache for Pokémon (home and detail)
* **Retry**: Exponential backoff with jitter (full, equal, decorrelated)

  * 3 attempts by default with initial delay of 1000ms
  * Retry on transient errors (429, 500, 503, 504) and network errors
* **Interceptor**: Request (cache read from IndexedDB) and Response (cache write to IndexedDB, retry logic)

## Full project structure

```
src/
  app/
    di/
      AppContainer.ts                # Main DI container (note: DEV inverted)
      pokegen/
        PokegenContainer.ts          # Pokegen DI container
    presentation/
      layout/                        # Hero, Navbar, Footer
      viewmodels/                    # NavbarViewModel
    routing/
      AppRouteName.ts                # Route enum (Home = '/')
      routes.ts                      # Router configuration
    styles/
    const.ts                         # App constants
    EnvironmentEnum.ts               # Environment enum
  core/
    contracts/                       # Abstract interfaces
    costants/                        # BASE_API_URL
    domain/                          # Result<T, E>
    enums/                           # ApplicationErrorCode
    errors/                          # Custom errors
    types/                           # Common types
    utils/                           # Pure utilities
  infrastructure/
    cache/
      InMemoryCache.ts               # In-memory cache
    indexedDb/
      CacheDb.ts                     # IndexedDB management
      CacheKeyFactory.ts             # Cache key generator
      types/                         # CacheItem, CacheMap, CachedResponse
    http/
      client/axios/                  # AxiosHttpClient, interceptors
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
        datasources/                 # API, mock, and aggregates
        models/                      # DTOs and types
        repositories/                # Repository implementations
        types/                       # Data-layer specific types
      domain/
        entities/                    # Generation, Pokemon
        repositories/                # Repository interfaces
        usecases/                    # Use case interfaces
      presentation/
        components/                  # Card, BadgeType, Skeleton, EvolutionChain
        controllers/                 # Orchestration
        mappers/                     # Domain → ViewModel (+ utils/evolution/)
        store/                       # Pinia stores
        viewmodels/                  # HomeViewModel, DetailViewModel
        views/                       # HomeView, DetailView
        routes.ts                    # Feature routes
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
      composables/                   # useIntersectionObserver for lazy loading
      controllers/                   # UseBlobController, UsePokeApiController
      viewmodels/                    # Shared ViewModels
    factories/                       # SharedContainer
assets/
  mock_data/                         # Mock JSON data
public/
  default_image.svg                  # Default Pokémon image
```

## Mock Data vs API

* **Development** (`npm run dev`): Uses mock data from `assets/mock_data/`
* **Production** (`npm run build`): Uses PokeAPI in production
* **Testing**: Uses mock data for deterministic tests

Note: the complete index for search is in `assets/mock_data/pokeapi-list.json`.

Selection happens automatically via factories based on `EnvironmentEnum`.

## Deploy to GitHub Pages

```bash
npm run deploy
```

Vite build + automatic deploy to `gh-pages` branch with `404.html` for SPA routing.

## Current status

✅ Complete generation system with navigation
✅ Pokémon list per generation with detailed cards
✅ Persistent cache and retry strategy
✅ Clean Architecture with modular DI
✅ SVG fallback images for missing artwork and sprites loaded via BlobController
✅ **Pokémon detail page** complete (stats, flavor text, size/capture rate, evolution chain)

## Latest updates

* **v1.4.0**: Cache refactor + shared PokeAPI search

  * Persistent cache moved to `infrastructure/indexedDb` and `InMemoryCache` introduced
  * Added `PokeApiRepository`, `GetPokeApiUseCase`, and `UsePokeApiController`
  * Added Pokémon search with dedicated input (debounce) and indexed list
* **v1.3.0**: Mapper and evolution utility refactor

  * Extracted `Traverse` from `PokemonMapper` into separate file `mappers/utils/Traverse.ts`
  * Extracted `BuildPokemonVM` and `BuildEvolutionVM` from `PokemonViewMapper` into `presentation/mappers/utils/evolution/`
  * Created a dedicated `Footer.vue` component for the app footer
  * Fixed home route from 'home' to '/' in `AppRouteName`
  * Extracted `main.js` to mount Footer on dedicated `#footer` element
  * Refactored `EvolutionChain.vue` to improve visual feedback ("no evolution" message)
  * Refactored `PokemonViewMapper.mapEvolutionToVM()` to handle evolution fallback
  * Improved maintainability, testability, and separation of mapper responsibilities

# PokéGen

Applicazione Vue 3 + Vite che esplora i Pokémon per generazione tramite PokeAPI, con fallback a dati mock per ambienti offline/CI. Interfaccia a schede con gradienti di tipo, navigazione per generazione e pagina di dettaglio in sviluppo.

## Caratteristiche
- Navigazione per generazione (`/generation/:id`) con elenco ordinato di Pokémon.
- Routing dedicato per il dettaglio (`/pokemon/:name/:id`), attualmente indicato come work in progress.
- Stato centralizzato con Pinia e controller/use-case che orchestrano repository e store.
- Client HTTP Axios con retry configurabile e mock data locali in `assets/mock_data` quando non si è in modalità dev.

## Stack tecnico
- Vue 3, Vite, Vue Router.
- Pinia per lo stato.
- Axios con HttpClient custom e retry.
- TypeScript ready (tsconfig incluso), Tailwind 4 per utilità stilistiche.
- Vitest + @vue/test-utils per i test unitari.

## Architettura (a strati)
- `src/app`: bootstrap, routing, DI dei controller/use-case/repository, provider Axios e Pinia, layout globali.
- `src/modules/pokegen`: feature PokéGen con suddivisione `domain` (entità, usecase), `application` (mapper e orchestrazione), `data` (datasource/repository verso PokeAPI o mock), `presentation` (controller, store, viewmodel, componenti e viste).
- `src/shared`: costanti, errori, tipi comuni, infrastruttura HTTP e cache condivise.
- `assets/mock_data`: dump PokeAPI per esecuzioni senza rete o in build.

## Rotte
- `/generation/:id` – lista Pokémon di una generazione.
- `/pokemon/:name/:id` – scheda dettaglio (placeholder “Work in progress”).
- `/:pathMatch(.*)*` – 404 personalizzata.

## Avvio rapido
Prerequisiti: Node 20.19+ o 22.12+.

```bash
npm install
npm run dev        # sviluppo
npm run build      # build + copia 404.html
npm run preview    # anteprima build
npm run deploy     # build e pubblicazione gh-pages (dist)
```

## Test
```bash
npm test           # vitest
npm run test:ui    # interfaccia interattiva vitest
npm run test:coverage
```

## Struttura progetto (estratto)
```
src/
	app/
		di/
		presentation/
		providers/
		routing/
		styles/
	modules/
		pokegen/
			application/
			data/
			domain/
			presentation/
	shared/
		core/
		infrastructure/
assets/
	mock_data/
```

## Note sui dati
- In dev usa la PokeAPI live; in build/CI vengono usati i mock per stabilità e velocità.
- I controller (es. `UsePokemonByGenerationController`) espongono `data`, `isLoading`, `error` come computed; gli store Pinia (`UseGenerationStore`, `UsePokegenStore`, `UsePokemonDetailStore`) gestiscono cache e fetch idempotenti.
- Il client Axios è configurato in `src/app/providers/Axios.ts` con retry ed exponential backoff.

## Deploy
- `npm run deploy` esegue build Vite e pubblica `dist/` su GitHub Pages (crea anche `dist/404.html` per SPA routing).

## Stato attuale
- Lista per generazione pronta; la pagina di dettaglio mostra placeholder “Work in progress”.

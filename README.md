# MovieVerse
Discover your next favorite movie. Angular 19 + TypeScript + RxJS + TMDB API.

## Setup
1. `npm install`
2. Get a free TMDB API key: https://www.themoviedb.org/settings/api
3. Paste it in `src/environments/environment.ts` (`tmdbKey`)
4. `npm start`, then open http://localhost:4200

## Where each Angular concept is used
- Components: `app.component`, `ui/movie-card`, `ui/movie-grid`, `ui/rail`, `pages/*`
- Routing + lazy loading + route params: `app.routes.ts` (`movie/:id`, `browse/:kind`)
- Services: `core/tmdb.service.ts` (API), `core/store.service.ts` (watchlist, history, theme, toasts)
- Interfaces: `core/models.ts`
- HttpClient + RxJS (debounceTime, switchMap, catchError): `pages/search.page.ts`
- Reactive Forms: search and filter form
- Pipes: `core/pipes.ts` (runtime, genres) plus built-in date/number
- LocalStorage: watchlist, history, search history, theme (via signals + effect)

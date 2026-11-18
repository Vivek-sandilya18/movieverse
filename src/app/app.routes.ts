import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage), title: 'MovieVerse' },
  { path: 'browse/:kind', loadComponent: () => import('./pages/browse.page').then(m => m.BrowsePage) },
  { path: 'search', loadComponent: () => import('./pages/search.page').then(m => m.SearchPage), title: 'Search | MovieVerse' },
  { path: 'movie/:id', loadComponent: () => import('./pages/details.page').then(m => m.DetailsPage) },
  { path: 'watchlist', loadComponent: () => import('./pages/watchlist.page').then(m => m.WatchlistPage), title: 'Watchlist | MovieVerse' },
  { path: 'recent', loadComponent: () => import('./pages/recent.page').then(m => m.RecentPage), title: 'Recently viewed | MovieVerse' },
  { path: '**', redirectTo: '' }
];

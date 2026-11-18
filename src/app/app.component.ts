import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from './core/store.service';

@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <aside class="side">
    <a routerLink="/" class="brand"><span class="lens"></span>MovieVerse</a>
    <nav aria-label="Main">
      <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">Discover</a>
      <a routerLink="/browse/trending" routerLinkActive="on">Trending</a>
      <a routerLink="/browse/top-rated" routerLinkActive="on">Top rated</a>
      <a routerLink="/browse/upcoming" routerLinkActive="on">Upcoming</a>
      <a routerLink="/browse/now-playing" routerLinkActive="on">Now playing</a>
      <a routerLink="/watchlist" routerLinkActive="on">Watchlist <b class="count">{{ store.watchlist().length }}</b></a>
      <a routerLink="/recent" routerLinkActive="on">Recently viewed</a>
      <a routerLink="/search" routerLinkActive="on">Search and filter</a>
    </nav>
    <button class="btn ghost theme" (click)="store.toggleTheme()">{{ store.theme() === 'dark' ? 'Switch to light' : 'Switch to dark' }}</button>
  </aside>
  <main>
    <header class="top">
      <input #q type="search" placeholder="Search movies, e.g. Interstellar" aria-label="Search movies" (keyup.enter)="go(q.value)">
      <button class="btn" (click)="go(q.value)">Search</button>
    </header>
    <router-outlet />
  </main>
  <div class="toasts" aria-live="polite">@for (t of store.toasts(); track t.id) { <div class="toast">{{ t.text }}</div> }</div>
  @if (showTop()) { <button class="totop" aria-label="Scroll to top" (click)="top()">↑</button> }`
})
export class AppComponent {
  store = inject(Store);
  private router = inject(Router);
  showTop = signal(false);
  go(q: string) { if (q.trim()) this.router.navigate(['/search'], { queryParams: { q: q.trim() } }); }
  top() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  @HostListener('window:scroll') onScroll() { this.showTop.set(window.scrollY > 600); }
}

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie, KINDS, img } from '../core/models';
import { TmdbService } from '../core/tmdb.service';
import { Store } from '../core/store.service';
import { RailComponent } from '../ui/rail.component';

@Component({
  selector: 'app-home', standalone: true, imports: [RouterLink, RailComponent],
  template: `
  @if (error()) { <div class="empty"><h3>Couldn't load movies</h3><p>{{ error() }}</p><button class="btn" (click)="ngOnInit()">Try again</button></div> }
  @if (hero(); as h) {
    <section class="hero" [style.background-image]="'linear-gradient(90deg, var(--bg) 8%, transparent 70%), url(' + img(h.backdrop_path, 'w1280') + ')'">
      <div class="hero-copy">
        <p class="kicker">Trending this week, rated {{ h.vote_average.toFixed(1) }}</p>
        <h1>{{ h.title }}</h1>
        <p class="lede">{{ h.overview }}</p>
        <div class="row">
          <a class="btn primary" [routerLink]="['/movie', h.id]">View details</a>
          <button class="btn" (click)="store.toggleWatch(h)">{{ store.has(h.id) ? 'In your watchlist' : 'Add to watchlist' }}</button>
        </div>
      </div>
    </section>
  } @else if (!error()) { <div class="hero sk"></div> }
  @for (k of kinds; track k) { <app-rail [title]="titles[k]" [kind]="k" [movies]="lists()[k] ?? []" /> }`
})
export class HomePage implements OnInit {
  private api = inject(TmdbService);
  store = inject(Store);
  img = img;
  kinds = ['trending', 'popular', 'top-rated', 'upcoming', 'now-playing'];
  titles: Record<string, string> = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, v.title]));
  lists = signal<Record<string, Movie[]>>({});
  error = signal('');
  hero = computed(() => (this.lists()['trending'] ?? []).find(m => m.backdrop_path) ?? null);
  ngOnInit() {
    this.error.set('');
    for (const k of this.kinds) {
      this.api.list(k).subscribe({
        next: r => this.lists.update(l => ({ ...l, [k]: r.results })),
        error: () => this.error.set('Check that your TMDB API key is set in src/environments/environment.ts and that you are online.')
      });
    }
  }
}

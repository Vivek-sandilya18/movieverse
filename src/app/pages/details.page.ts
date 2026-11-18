import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { switchMap, tap } from 'rxjs';
import { MovieDetails, img } from '../core/models';
import { TmdbService } from '../core/tmdb.service';
import { Store } from '../core/store.service';
import { RuntimePipe } from '../core/pipes';
import { MovieCardComponent } from '../ui/movie-card.component';

@Component({
  selector: 'app-details', standalone: true, imports: [RouterLink, DatePipe, DecimalPipe, RuntimePipe, MovieCardComponent],
  template: `
  @if (error()) { <div class="empty"><h3>Couldn't load this movie</h3><p>{{ error() }}</p><a class="btn" routerLink="/">Back to discover</a></div> }
  @else { @if (m(); as d) {
    <section class="detail" [style.background-image]="'linear-gradient(0deg, var(--bg) 4%, transparent 80%), url(' + img(d.backdrop_path, 'w1280') + ')'">
      <img class="dposter" [src]="img(d.poster_path, 'w500')" [alt]="d.title + ' poster'">
      <div>
        <h1>{{ d.title }}</h1>
        @if (d.tagline) { <p class="tag">{{ d.tagline }}</p> }
        <p class="facts"><b>{{ d.vote_average | number: '1.1-1' }}</b> rating
          <span>{{ d.release_date | date: 'longDate' }}</span><span>{{ d.runtime | runtime }}</span>
          <span>{{ langs() }}</span></p>
        <div class="chips">@for (g of d.genres; track g.id) { <span class="chip">{{ g.name }}</span> }</div>
        <div class="row">
          @if (trailer(); as t) { <button class="btn primary" (click)="open.set(true)">Watch trailer</button> }
          <button class="btn" (click)="store.toggleWatch(d)">{{ store.has(d.id) ? 'Remove from watchlist' : 'Add to watchlist' }}</button>
        </div>
      </div>
    </section>
    <div class="cols">
      <section><h2>Overview</h2><p class="lede">{{ d.overview || 'No overview available yet.' }}</p>
        <p><b>Director:</b> {{ director() }}</p></section>
      <section><h2>Cast</h2>
        <ul class="cast">@for (c of d.credits.cast.slice(0, 8); track c.id) { <li><b>{{ c.name }}</b><span>{{ c.character }}</span></li> }</ul></section>
    </div>
    @if (d.similar.results.length) {
      <section class="rail-sec"><div class="rail-head"><h2>Similar movies</h2></div>
        <div class="rail-row">@for (s of d.similar.results.slice(0, 12); track s.id) { <app-movie-card [m]="s" /> }</div></section>
    }
    @if (open() && trailer(); as t) {
      <div class="modal" (click)="open.set(false)" (keydown.escape)="open.set(false)" role="dialog" aria-label="Trailer" tabindex="-1">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <button class="btn close" (click)="open.set(false)">Close trailer</button>
          <iframe [src]="t" title="Trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
        </div>
      </div>
    }
  } @else { <div class="detail sk"></div> } }`
})
export class DetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(TmdbService);
  private san = inject(DomSanitizer);
  private title = inject(Title);
  store = inject(Store);
  img = img;
  m = signal<MovieDetails | null>(null); error = signal(''); open = signal(false);
  trailer = computed<SafeResourceUrl | null>(() => {
    const v = this.m()?.videos.results.find(x => x.site === 'YouTube' && x.type === 'Trailer');
    return v ? this.san.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${v.key}?autoplay=1`) : null;
  });
  director = computed(() => this.m()?.credits.crew.find(c => c.job === 'Director')?.name ?? 'Not listed');
  langs = computed(() => this.m()?.spoken_languages.map(l => l.english_name).join(', ') || 'Language not listed');
  ngOnInit() {
    this.route.paramMap.pipe(
      tap(() => { this.m.set(null); this.error.set(''); this.open.set(false); }),
      switchMap(p => this.api.details(p.get('id') ?? ''))
    ).subscribe({
      next: d => { this.m.set(d); this.store.view(d); this.title.setTitle(`${d.title} | MovieVerse`); },
      error: () => this.error.set('The movie may not exist, or your TMDB API key is missing.')
    });
  }
}

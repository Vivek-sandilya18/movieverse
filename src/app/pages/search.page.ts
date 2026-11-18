import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Subject, catchError, debounceTime, merge, of, startWith, switchMap, tap } from 'rxjs';
import { GENRES, Movie, Paged } from '../core/models';
import { TmdbService } from '../core/tmdb.service';
import { Store } from '../core/store.service';
import { MovieGridComponent } from '../ui/movie-grid.component';

@Component({
  selector: 'app-search', standalone: true, imports: [ReactiveFormsModule, MovieGridComponent],
  template: `
  <h1 class="page-title">Search and filter</h1>
  <form [formGroup]="form" class="filters" (submit)="$event.preventDefault()">
    <input class="wide" type="search" formControlName="q" placeholder="Search by title" aria-label="Title">
    <select formControlName="genre" aria-label="Genre"><option [value]="0">All genres</option>@for (g of genres; track g.id) { <option [value]="g.id">{{ g.name }}</option> }</select>
    <select formControlName="rating" aria-label="Minimum rating"><option [value]="0">Any rating</option><option [value]="6">6+</option><option [value]="7">7+</option><option [value]="8">8+</option></select>
    <input type="number" formControlName="year" placeholder="Year" min="1900" max="2100" aria-label="Release year">
    <select formControlName="lang" aria-label="Language"><option value="">Any language</option><option value="en">English</option><option value="hi">Hindi</option><option value="ko">Korean</option><option value="ja">Japanese</option><option value="es">Spanish</option><option value="fr">French</option></select>
    <select formControlName="sort" aria-label="Sort by">
      <option value="popularity.desc">Most popular</option><option value="vote_average.desc">Highest rated</option>
      <option value="primary_release_date.desc">Newest first</option><option value="primary_release_date.asc">Oldest first</option>
    </select>
  </form>
  @if (!form.value.q && store.searches().length) {
    <div class="chips"><span>Recent searches</span>
      @for (s of store.searches(); track s) { <button class="chip" (click)="form.patchValue({ q: s })">{{ s }}</button> }
      <button class="chip clear" (click)="store.clearSearches()">Clear</button></div>
  }
  <app-movie-grid [movies]="movies()" [loading]="loading()" [error]="error()" [hasMore]="page < pages" (more)="loadMore()" (retry)="more$.next()"
    emptyTitle="No movies found" emptyText="Nothing matches that title and filter combination. Check the spelling or remove a filter." />`
})
export class SearchPage implements OnInit {
  private api = inject(TmdbService);
  private route = inject(ActivatedRoute);
  store = inject(Store);
  genres = GENRES;
  more$ = new Subject<void>();
  page = 1; pages = 1;
  movies = signal<Movie[]>([]); loading = signal(false); error = signal('');
  form = inject(FormBuilder).nonNullable.group({ q: '', genre: 0, rating: 0, year: '', lang: '', sort: 'popularity.desc' });

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) this.form.patchValue({ q }, { emitEvent: false });
    merge(this.form.valueChanges.pipe(debounceTime(350), tap(() => (this.page = 1))), this.more$).pipe(
      startWith(null),
      tap(() => { this.loading.set(true); this.error.set(''); const q = this.form.value.q?.trim(); if (q && q.length > 2 && this.page === 1) this.store.addSearch(q); }),
      switchMap(() => this.load().pipe(catchError(() => { this.error.set('Check your TMDB API key and internet connection.'); return of(null); })))
    ).subscribe(r => {
      this.loading.set(false);
      if (!r) return;
      this.pages = Math.min(r.total_pages, 500);
      this.movies.update(m => (this.page > 1 ? [...m, ...r.results] : r.results));
    });
  }
  loadMore() { this.page++; this.more$.next(); }

  private load() {
    const f = this.form.getRawValue();
    const q = f.q.trim();
    if (!q) return this.api.discover({ ...f, genre: +f.genre, rating: +f.rating, page: this.page });
    return this.api.search(q, this.page).pipe(switchMap(r => of(this.refine(r, f))));
  }
  // TMDB's title search has no filter params, so filters are applied to the results here.
  private refine(r: Paged<Movie>, f: { genre: number; rating: number; year: string; lang: string; sort: string }): Paged<Movie> {
    let out = r.results.filter(m =>
      (!+f.genre || m.genre_ids?.includes(+f.genre)) && m.vote_average >= +f.rating &&
      (!f.year || m.release_date?.startsWith(f.year)) && (!f.lang || m.original_language === f.lang));
    const key = f.sort.split('.')[0], dir = f.sort.endsWith('asc') ? 1 : -1;
    const val = (m: Movie) => key === 'vote_average' ? m.vote_average : key === 'popularity' ? (m.popularity ?? 0) : Date.parse(m.release_date || '1900-01-01');
    out = [...out].sort((a, b) => (val(a) - val(b)) * dir);
    return { ...r, results: out };
  }
}

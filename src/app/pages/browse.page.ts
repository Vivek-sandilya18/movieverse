import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie, KINDS } from '../core/models';
import { TmdbService } from '../core/tmdb.service';
import { MovieGridComponent } from '../ui/movie-grid.component';

@Component({
  selector: 'app-browse', standalone: true, imports: [MovieGridComponent],
  template: `
  <h1 class="page-title">{{ title() }}</h1>
  <app-movie-grid [movies]="movies()" [loading]="loading()" [error]="error()" [hasMore]="page < pages" (more)="more()" (retry)="fetch()" />`
})
export class BrowsePage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(TmdbService);
  kind = 'popular'; page = 1; pages = 1;
  title = signal(''); movies = signal<Movie[]>([]); loading = signal(false); error = signal('');
  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      const k = p.get('kind') ?? 'popular';
      this.kind = KINDS[k] ? k : 'popular';
      this.title.set(KINDS[this.kind].title);
      this.movies.set([]); this.page = 1; this.fetch();
    });
  }
  fetch() {
    this.loading.set(true); this.error.set('');
    this.api.list(this.kind, this.page).subscribe({
      next: r => { this.pages = Math.min(r.total_pages, 500); this.movies.update(m => [...m, ...r.results]); this.loading.set(false); },
      error: () => { this.error.set('Check your TMDB API key and internet connection.'); this.loading.set(false); }
    });
  }
  more() { this.page++; this.fetch(); }
}

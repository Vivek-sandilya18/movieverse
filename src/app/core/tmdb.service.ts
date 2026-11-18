import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Movie, MovieDetails, Paged, KINDS } from './models';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private http = inject(HttpClient);
  private get<T>(path: string, params: Record<string, string | number> = {}): Observable<T> {
    let p = new HttpParams().set('api_key', env.tmdbKey).set('language', 'en-US');
    for (const [k, v] of Object.entries(params)) if (v !== '' && v !== 0) p = p.set(k, String(v));
    return this.http.get<T>(`${env.api}/${path}`, { params: p });
  }
  list(kind: string, page = 1) { return this.get<Paged<Movie>>(KINDS[kind].path, { page }); }
  search(query: string, page = 1) { return this.get<Paged<Movie>>('search/movie', { query, page, include_adult: 'false' }); }
  discover(f: { genre: number; rating: number; year: string; lang: string; sort: string; page: number }) {
    return this.get<Paged<Movie>>('discover/movie', {
      page: f.page, sort_by: f.sort, with_genres: f.genre, 'vote_average.gte': f.rating,
      primary_release_year: f.year, with_original_language: f.lang, 'vote_count.gte': f.sort.startsWith('vote') ? 300 : 0
    });
  }
  details(id: string) { return this.get<MovieDetails>(`movie/${id}`, { append_to_response: 'videos,credits,similar' }); }
}

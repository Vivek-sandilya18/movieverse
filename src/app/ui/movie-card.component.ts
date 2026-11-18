import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Movie, img } from '../core/models';
import { Store } from '../core/store.service';
import { GenresPipe } from '../core/pipes';

@Component({
  selector: 'app-movie-card', standalone: true, imports: [RouterLink, DatePipe, DecimalPipe, GenresPipe],
  template: `
  <a class="card" [routerLink]="['/movie', m.id]">
    <div class="poster">
      @if (m.poster_path) { <img loading="lazy" [src]="img(m.poster_path)" [alt]="m.title + ' poster'"> }
      @else { <span class="noimg">{{ m.title }}</span> }
      <span class="ring" [style.--p]="m.vote_average * 10"><i>{{ m.vote_average | number: '1.1-1' }}</i></span>
      <button class="heart" type="button" [class.on]="store.has(m.id)" [attr.aria-label]="store.has(m.id) ? 'Remove from watchlist' : 'Add to watchlist'" (click)="toggle($event)">
        {{ store.has(m.id) ? '♥' : '♡' }}
      </button>
    </div>
    <h3>{{ m.title }}</h3>
    <p class="meta"><span>{{ m.release_date | date: 'yyyy' }}</span><span>{{ m.genre_ids | genres }}</span></p>
  </a>`
})
export class MovieCardComponent {
  @Input({ required: true }) m!: Movie;
  store = inject(Store);
  img = img;
  toggle(e: Event) { e.preventDefault(); e.stopPropagation(); this.store.toggleWatch(this.m); }
}

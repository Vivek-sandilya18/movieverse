import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '../core/store.service';
import { img } from '../core/models';

@Component({
  selector: 'app-watchlist', standalone: true, imports: [RouterLink, DatePipe],
  template: `
  <h1 class="page-title">Watchlist <span class="count">{{ store.watchlist().length }}</span></h1>
  @if (!store.watchlist().length) {
    <div class="empty"><h3>Your watchlist is empty</h3><p>Tap the heart on any movie to save it here.</p><a class="btn" routerLink="/">Find movies</a></div>
  } @else {
    <ul class="list">
      @for (w of store.watchlist(); track w.id) {
        <li [class.done]="w.watched">
          <a [routerLink]="['/movie', w.id]">@if (w.poster_path) { <img [src]="img(w.poster_path, 'w185')" [alt]="w.title + ' poster'"> } @else { <span class="thumb"></span> }</a>
          <div><a [routerLink]="['/movie', w.id]"><b>{{ w.title }}</b></a><span>{{ w.release_date | date: 'yyyy' }}, rated {{ w.vote_average.toFixed(1) }}</span></div>
          <button class="btn" (click)="store.toggleWatched(w.id)">{{ w.watched ? 'Mark as not watched' : 'Mark as watched' }}</button>
          <button class="btn ghost" (click)="remove(w.id)">Remove</button>
        </li>
      }
    </ul>
  }`
})
export class WatchlistPage {
  store = inject(Store); img = img;
  remove(id: number) { this.store.watchlist.update(l => l.filter(w => w.id !== id)); this.store.toast('Removed from watchlist'); }
}

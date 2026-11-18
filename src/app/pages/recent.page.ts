import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '../core/store.service';
import { img } from '../core/models';

@Component({
  selector: 'app-recent', standalone: true, imports: [RouterLink, DatePipe],
  template: `
  <h1 class="page-title">Recently viewed
    @if (store.history().length) { <button class="btn ghost" (click)="store.clearHistory()">Clear history</button> }</h1>
  @if (!store.history().length) {
    <div class="empty"><h3>Nothing viewed yet</h3><p>Movies you open will show up here.</p><a class="btn" routerLink="/">Discover movies</a></div>
  } @else {
    <ul class="list">
      @for (h of store.history(); track h.id) {
        <li>
          <a [routerLink]="['/movie', h.id]">@if (h.poster_path) { <img [src]="img(h.poster_path, 'w185')" [alt]="h.title + ' poster'"> } @else { <span class="thumb"></span> }</a>
          <div><a [routerLink]="['/movie', h.id]"><b>{{ h.title }}</b></a><span>Last viewed {{ h.viewedAt | date: 'medium' }}</span></div>
          <button class="btn ghost" (click)="store.removeHistory(h.id)">Remove</button>
        </li>
      }
    </ul>
  }`
})
export class RecentPage { store = inject(Store); img = img; }

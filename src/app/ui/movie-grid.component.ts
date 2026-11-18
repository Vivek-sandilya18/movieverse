import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../core/models';
import { MovieCardComponent } from './movie-card.component';

@Component({
  selector: 'app-movie-grid', standalone: true, imports: [MovieCardComponent],
  template: `
  @if (error) {
    <div class="empty"><h3>Couldn't load movies</h3><p>{{ error }}</p><button class="btn" (click)="retry.emit()">Try again</button></div>
  } @else if (loading && !movies.length) {
    <div class="grid">@for (n of skeletons; track n) { <div class="sk"></div> }</div>
  } @else if (!movies.length) {
    <div class="empty"><h3>{{ emptyTitle }}</h3><p>{{ emptyText }}</p></div>
  } @else {
    <div class="grid">@for (m of movies; track m.id) { <app-movie-card [m]="m" /> }</div>
    @if (hasMore) { <div class="more"><button class="btn" [disabled]="loading" (click)="more.emit()">{{ loading ? 'Loading...' : 'Load more' }}</button></div> }
  }`
})
export class MovieGridComponent {
  @Input() movies: Movie[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() hasMore = false;
  @Input() emptyTitle = 'No results found';
  @Input() emptyText = 'Try a different title or loosen your filters.';
  @Output() more = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  skeletons = Array.from({ length: 10 }, (_, i) => i);
}

import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../core/models';
import { MovieCardComponent } from './movie-card.component';

@Component({
  selector: 'app-rail', standalone: true, imports: [RouterLink, MovieCardComponent],
  template: `
  <section class="rail-sec">
    <div class="rail-head"><h2>{{ title }}</h2><a [routerLink]="['/browse', kind]">See all</a></div>
    <div class="rail-row">
      @if (movies.length) { @for (m of movies; track m.id) { <app-movie-card [m]="m" /> } }
      @else { @for (n of [1,2,3,4,5,6,7]; track n) { <div class="sk"></div> } }
    </div>
  </section>`
})
export class RailComponent {
  @Input() title = '';
  @Input() kind = 'popular';
  @Input() movies: Movie[] = [];
}

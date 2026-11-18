import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'runtime', standalone: true })
export class RuntimePipe implements PipeTransform {
  transform(mins: number | null | undefined): string {
    if (!mins) return 'Runtime unknown';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
}
@Pipe({ name: 'genres', standalone: true })
export class GenresPipe implements PipeTransform {
  private map: Record<number, string> = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 18: 'Drama', 27: 'Horror', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller' };
  transform(ids: number[] | undefined): string {
    return (ids ?? []).map(i => this.map[i]).filter(Boolean).slice(0, 2).join(', ');
  }
}

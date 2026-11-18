import { Injectable, effect, signal } from '@angular/core';
import { HistoryItem, Movie, WatchItem } from './models';

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

@Injectable({ providedIn: 'root' })
export class Store {
  watchlist = signal<WatchItem[]>(load('cs.watchlist', []));
  history = signal<HistoryItem[]>(load('cs.history', []));
  searches = signal<string[]>(load('cs.searches', []));
  theme = signal<'dark' | 'light'>(load('cs.theme', 'dark'));
  toasts = signal<{ id: number; text: string }[]>([]);

  constructor() {
    effect(() => {
      const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
      save('cs.watchlist', this.watchlist()); save('cs.history', this.history());
      save('cs.searches', this.searches()); save('cs.theme', this.theme());
      document.documentElement.dataset['theme'] = this.theme();
    });
  }
  toast(text: string) {
    const id = Date.now() + Math.random();
    this.toasts.update(t => [...t, { id, text }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 2600);
  }
  toggleTheme() { this.theme.update(t => (t === 'dark' ? 'light' : 'dark')); }
  has(id: number) { return this.watchlist().some(w => w.id === id); }
  toggleWatch(m: Movie) {
    if (this.has(m.id)) { this.watchlist.update(l => l.filter(w => w.id !== m.id)); this.toast(`Removed ${m.title} from watchlist`); }
    else {
      this.watchlist.update(l => [{ id: m.id, title: m.title, poster_path: m.poster_path, release_date: m.release_date, vote_average: m.vote_average, watched: false }, ...l]);
      this.toast(`Added ${m.title} to watchlist`);
    }
  }
  toggleWatched(id: number) { this.watchlist.update(l => l.map(w => (w.id === id ? { ...w, watched: !w.watched } : w))); }
  view(m: Movie) {
    this.history.update(h => [{ id: m.id, title: m.title, poster_path: m.poster_path, viewedAt: Date.now() }, ...h.filter(x => x.id !== m.id)].slice(0, 30));
  }
  removeHistory(id: number) { this.history.update(h => h.filter(x => x.id !== id)); }
  clearHistory() { this.history.set([]); this.toast('History cleared'); }
  addSearch(q: string) { this.searches.update(s => [q, ...s.filter(x => x !== q)].slice(0, 6)); }
  clearSearches() { this.searches.set([]); }
}

export interface Genre { id: number; name: string; }
export interface Movie {
  id: number; title: string; poster_path: string | null; backdrop_path: string | null; overview: string;
  vote_average: number; release_date: string; genre_ids?: number[]; original_language?: string; popularity?: number;
}
export interface Cast { id: number; name: string; character: string; profile_path: string | null; }
export interface MovieDetails extends Movie {
  runtime: number; genres: Genre[]; tagline: string; spoken_languages: { english_name: string }[];
  videos: { results: { key: string; site: string; type: string }[] };
  credits: { cast: Cast[]; crew: { job: string; name: string }[] };
  similar: { results: Movie[] };
}
export interface Paged<T> { results: T[]; page: number; total_pages: number; }
export interface WatchItem { id: number; title: string; poster_path: string | null; release_date: string; vote_average: number; watched: boolean; }
export interface HistoryItem { id: number; title: string; poster_path: string | null; viewedAt: number; }
export const GENRES: Genre[] = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' }, { id: 53, name: 'Thriller' }
];
export const KINDS: Record<string, { title: string; path: string }> = {
  trending: { title: 'Trending this week', path: 'trending/movie/week' },
  popular: { title: 'Popular', path: 'movie/popular' },
  'top-rated': { title: 'Top rated', path: 'movie/top_rated' },
  upcoming: { title: 'Upcoming', path: 'movie/upcoming' },
  'now-playing': { title: 'Now playing', path: 'movie/now_playing' }
};
export const img = (p: string | null, size = 'w342') => (p ? `https://image.tmdb.org/t/p/${size}${p}` : '');

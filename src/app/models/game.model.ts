// src/app/models/game.model.ts
export interface EsrbRating {
  id: number;
  slug: string;
  name: string;
}

export interface PlatformRequirements {
  minimum: string;
  recommended: string;
}

export interface Platform {
  platform: {
    id: number;
    slug: string;
    name: string;
  };
  released_at: string;
  requirements: PlatformRequirements;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Record<string, any>;
  ratings_count: number;
  reviews_text_count: string;
  added: number;
  added_by_status: Record<string, any>;
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  esrb_rating: EsrbRating;
  platforms: Platform[];
}

export interface ApiResponse {
  count: number;
  next: string;
  previous: string;
  results: Game[];
}

export interface SavedGame {
  id?: number;
  title: string;
  release_date: string;
  img_url: string,
  rawg_id: number,
}
export interface ItemDto {
  id: string;
  title: string;
  descripcion?: string;
  releaseDate?: string;
  rating?: number;
  mediaType: string;
  platform?: string;
  format: string;
  isbnOrUpc?: string;
  mainImageUrl?: string;
  isFavorite: boolean;
  genres: string[];
  creators: string[];
  mediaTypeId: string;
  formatId: string;
  platformId?: string;
  genreIds: string[];
  creatorIds: string[];
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface CrearItemDto {
  title: string;
  descripcion?: string;
  releaseDate?: string;
  rating?: number;
  isFavorite: boolean;
  isbnOrUpc?: string;
  metadata?: Record<string, unknown>;
  mediaTypeId: string;
  formatId: string;
  platformId?: string;
  genreIds: string[];
  creatorIds: string[];
}

export interface ActualizarItemDto {
  title: string;
  descripcion?: string;
  releaseDate?: string;
  rating?: number;
  isFavorite: boolean;
  isbnOrUpc?: string;
  metadata?: Record<string, unknown>;
  mediaTypeId: string;
  formatId: string;
  platformId?: string;
  genreIds: string[];
  creatorIds: string[];
}

export interface ItemDto {
  id: string;
  title: string;
  descripcion?: string;
  releaseDate?: string;
  rating?: number;
  mediaType: string;
  platforms: string[];
  formats: string[];
  isbnOrUpc?: string;
  mainImageUrl?: string;
  isFavorite: boolean;
  genres: string[];
  creators: string[];
  mediaTypeId: string;
  formatIds: string[];
  platformIds: string[];
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
  formatIds: string[];
  platformIds: string[];
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
  formatIds: string[];
  platformIds: string[];
  genreIds: string[];
  creatorIds: string[];
}

export interface ImagenItemDto {
  id: string;
  itemId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string;
}

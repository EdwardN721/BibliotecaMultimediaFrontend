export interface ItemDto {
  id: string;
  title: string;
  descripcion?: string;
  releaseDate: string;
  rating: number;
  mediaType: string;
  platform: string;
  format: string;
  isbnOrUpc?: string;
  mainImageUrl?: string;
  isFavorite: boolean;
  genres: string[];
  creators: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CrearItemDto {
  title: string;
  releaseDate: string;
  rating: number;
  isFavorite: boolean;
  Metadata: any;
  mediaTypeId: string;
  formatId: string;
  platformId: string;
  genreIds: string[];
  creatorIds: string[];
}

export interface ActualizarItemDto {
  title: string;
  releaseDate: string;
  rating: number;
  isFavorite: boolean;
  Metadata: any;
  mediaTypeId: string;
  formatId: string;
  platformId: string;
  genreIds: string[];
  creatorIds: string[];
}

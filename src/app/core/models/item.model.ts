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

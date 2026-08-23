export enum ConsumptionStatus {
  Pendiente = 'Pendiente',
  EnProgreso = 'EnProgreso',
  Completado = 'Completado',
  Abandonado = 'Abandonado',
}

export const CONSUMPTION_STATUS_LABELS: Record<ConsumptionStatus, string> = {
  [ConsumptionStatus.Pendiente]: 'Pendiente',
  [ConsumptionStatus.EnProgreso]: 'En progreso',
  [ConsumptionStatus.Completado]: 'Completado',
  [ConsumptionStatus.Abandonado]: 'Abandonado',
};

export interface RespuestaUserItemDto {
  id: string;
  itemId: string;
  titulo: string;
  mediaType: string;
  formats: string[];
  platforms: string[];
  genres: string[];
  creators: string[];
  imageUrl?: string;
  status: ConsumptionStatus;
  progress?: string;
  isFavorite: boolean;
  personalRating?: number;
  review?: string;
  isPrivate: boolean;
  dateAdded?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PeticionAgregarABibliotecaDto {
  itemId: string;
  status: ConsumptionStatus;
  progress?: string;
  isFavorite: boolean;
  personalRating?: number;
  review?: string;
  isPrivate: boolean;
  startedAt?: string;
  finishedAt?: string;
}

export interface PeticionActualizarUserItemDto {
  status?: ConsumptionStatus;
  progress?: string;
  isFavorite?: boolean;
  personalRating?: number;
  review?: string;
  isPrivate?: boolean;
  startedAt?: string;
  finishedAt?: string;
}

export interface FiltroBiblioteca {
  terminoBusqueda?: string;
  status?: ConsumptionStatus;
  isFavorite?: boolean;
  ordenarPor?: string;
  ordenDescendente?: boolean;
}

export interface PaginacionMetadata {
  paginaActual: number;
  totalPaginas: number;
  registrosPorPagina: number;
  totalRegistros: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RespuestaPaginada<T> {
  registros: T[];
  metadata: PaginacionMetadata;
}
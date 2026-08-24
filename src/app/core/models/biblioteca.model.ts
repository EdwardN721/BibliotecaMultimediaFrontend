export enum ConsumptionStatus {
  Pendiente = 'Pendiente',
  EnProgreso = 'EnProgreso',
  Completado = 'Completado',
  Abandonado = 'Abandonado',
  /** Título que el usuario quiere conseguir algún día (lista de deseos) */
  Deseado = 'Deseado',
}

export const CONSUMPTION_STATUS_LABELS: Record<ConsumptionStatus, string> = {
  [ConsumptionStatus.Pendiente]: 'Pendiente',
  [ConsumptionStatus.EnProgreso]: 'En progreso',
  [ConsumptionStatus.Completado]: 'Completado',
  [ConsumptionStatus.Abandonado]: 'Abandonado',
  [ConsumptionStatus.Deseado]: 'Deseado',
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
  /** Formatos en que el usuario posee el título */
  ownedFormats?: string[];
  /** Ids de los formatos propios del usuario */
  ownedFormatIds?: string[];
  /** Plataformas/consolas en que el usuario posee el título */
  ownedPlatforms?: string[];
  /** Ids de las plataformas propias del usuario */
  ownedPlatformIds?: string[];
  /** Nombre de la persona que tiene el título prestado ahora mismo (si aplica) */
  prestamoActivoA?: string | null;
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
  ownedFormatIds?: string[];
  ownedPlatformIds?: string[];
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
  /** null/undefined = no tocar; array (aunque vacío) = sincronizar */
  ownedFormatIds?: string[];
  ownedPlatformIds?: string[];
}

export interface FiltroBiblioteca {
  terminoBusqueda?: string;
  status?: ConsumptionStatus;
  isFavorite?: boolean;
  ordenarPor?: string;
  ordenDescendente?: boolean;
}

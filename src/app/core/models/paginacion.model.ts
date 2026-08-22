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
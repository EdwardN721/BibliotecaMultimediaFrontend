export interface ConteoCatalogo {
  mediaTypeId: string;
  nombre: string;
  cantidad: number;
}

export interface BibliotecaStats {
  totalItems: number;
  pendientes: number;
  enProgreso: number;
  completados: number;
  abandonados: number;
  deseados: number;
  favoritos: number;
  ratingPromedio: number;
  /** Préstamos sin devolución registrada */
  prestadosActivos: number;
  /** Títulos en biblioteca agrupados por tipo de medio */
  porCatalogo: ConteoCatalogo[];
}

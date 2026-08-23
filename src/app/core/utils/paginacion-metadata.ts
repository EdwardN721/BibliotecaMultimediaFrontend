import { HttpResponse } from '@angular/common/http';
import { PaginacionMetadata } from '@core/models/paginacion.model';

/** Lee la cabecera X-Pagination que envía el backend en respuestas paginadas. */
export function leerMetadataPaginada<T>(respuesta: HttpResponse<T[]>): PaginacionMetadata {
  const porDefecto: PaginacionMetadata = {
    paginaActual: 1,
    totalPaginas: 0,
    registrosPorPagina: 10,
    totalRegistros: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const header = respuesta.headers.get('X-Pagination');
  if (!header) {
    return porDefecto;
  }

  try {
    return { ...porDefecto, ...JSON.parse(header) };
  } catch {
    return porDefecto;
  }
}

import { HttpParams } from '@angular/common/http';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';

export function buildPaginationParams(
  filtro: FiltroGlobal,
  pageNumber: number = 1,
  pageSize: number = 10,
): HttpParams {
  let params: HttpParams = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  if (filtro.terminoBusqueda) {
    params = params.set('TerminoBusqueda', filtro.terminoBusqueda);
  }

  if (filtro.ordenadoPor) {
    params = params.set('OrdenarPor', filtro.ordenadoPor);
  }

  if (filtro.ordenDescendente !== undefined) {
    params = params.set('OrdenDescendente', filtro.ordenDescendente);
  }

  return params;
}
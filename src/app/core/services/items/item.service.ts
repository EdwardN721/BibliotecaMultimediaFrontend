import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActualizarItemDto, CrearItemDto, ItemDto } from '@core/models/item.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { PaginacionMetadata, RespuestaPaginada } from '@core/models/paginacion.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Item`

  obtenerItems(
    filtoPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<RespuestaPaginada<ItemDto>> {
    const params: HttpParams = buildPaginationParams(filtoPaginado, pageNumber, pageSize);

    return this.http
      .get<ItemDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' })
      .pipe(
        map((respuesta: HttpResponse<ItemDto[]>) => ({
          registros: respuesta.body ?? [],
          metadata: this.leerMetadata(respuesta),
        })),
      );
  }

  obtenerItemPorId(id: string): Observable<ItemDto> {
    return this.http.get<ItemDto>(`${this.apiUrl}/${id}`);
  }

  crearItem(item: CrearItemDto): Observable<ItemDto> {
    return this.http.post<ItemDto>(this.apiUrl, item);
  }

  actualizarItem(id: string, item: ActualizarItemDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  eliminarItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private leerMetadata(respuesta: HttpResponse<ItemDto[]>): PaginacionMetadata {
    const header = respuesta.headers.get('X-Pagination');
    const porDefecto: PaginacionMetadata = {
      paginaActual: 1,
      totalPaginas: 0,
      registrosPorPagina: 10,
      totalRegistros: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    if (!header) {
      return porDefecto;
    }

    try {
      return { ...porDefecto, ...JSON.parse(header) };
    } catch {
      return porDefecto;
    }
  }
}
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActualizarGeneroDto, AgregarGeneroDto, GeneroDto } from '@core/models/generos.model';
import { PaginacionMetadata, RespuestaPaginada } from '@core/models/paginacion.model';

@Injectable({
  providedIn: 'root',
})
export class GenerosService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Genres`;

  obtenerGeneros(
    filtroPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<RespuestaPaginada<GeneroDto>> {
    const params: HttpParams = buildPaginationParams(filtroPaginado, pageNumber, pageSize);

    return this.http.get<GeneroDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' }).pipe(
      map((respuesta) => ({
        registros: respuesta.body ?? [],
        metadata: this.leerMetadata(respuesta),
      })),
    );
  }

  private leerMetadata(respuesta: HttpResponse<GeneroDto[]>): PaginacionMetadata {
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
      const metadata = JSON.parse(header) as Partial<PaginacionMetadata>;
      return { ...porDefecto, ...metadata };
    } catch {
      return porDefecto;
    }
  }

  obtenerGeneroPorId(id: string): Observable<GeneroDto> {
    return this.http.get<GeneroDto>(`${this.apiUrl}/${id}`);
  }

  agregarGenero(genero: AgregarGeneroDto): Observable<GeneroDto> {
    return this.http.post<GeneroDto>(this.apiUrl, genero);
  }

  actualizarGenero(id: string, genero: ActualizarGeneroDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, genero);
  }

  eliminarGenero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FiltroBiblioteca,
  PeticionActualizarUserItemDto,
  PeticionAgregarABibliotecaDto,
  RespuestaUserItemDto,
} from '@core/models/biblioteca.model';
import { RespuestaPaginada } from '@core/models/paginacion.model';
import { BibliotecaStats } from '@core/models/biblioteca-stats.model';
import { leerMetadataPaginada } from '@core/utils/paginacion-metadata';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Biblioteca`;

  obtenerBiblioteca(
    filtro: FiltroBiblioteca = {},
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<RespuestaPaginada<RespuestaUserItemDto>> {
    let params: HttpParams = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (filtro.terminoBusqueda) {
      params = params.set('TerminoBusqueda', filtro.terminoBusqueda);
    }
    if (filtro.status !== undefined) {
      params = params.set('Status', filtro.status);
    }
    if (filtro.isFavorite !== undefined) {
      params = params.set('IsFavorite', filtro.isFavorite);
    }
    if (filtro.ordenarPor) {
      params = params.set('OrdenarPor', filtro.ordenarPor);
    }
    if (filtro.ordenDescendente !== undefined) {
      params = params.set('OrdenDescendente', filtro.ordenDescendente);
    }

    return this.http
      .get<RespuestaUserItemDto[]>(`${this.apiUrl}/paginado`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((respuesta: HttpResponse<RespuestaUserItemDto[]>) => ({
          registros: respuesta.body ?? [],
          metadata: leerMetadataPaginada(respuesta),
        })),
      );
  }

  obtenerStats(): Observable<BibliotecaStats> {
    return this.http.get<BibliotecaStats>(`${this.apiUrl}/stats`);
  }

  obtenerItemDeBiblioteca(id: string): Observable<RespuestaUserItemDto> {
    return this.http.get<RespuestaUserItemDto>(`${this.apiUrl}/${id}`);
  }

  agregarABiblioteca(dto: PeticionAgregarABibliotecaDto): Observable<RespuestaUserItemDto> {
    return this.http.post<RespuestaUserItemDto>(this.apiUrl, dto);
  }

  actualizarItemDeBiblioteca(id: string, dto: PeticionActualizarUserItemDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarDeBiblioteca(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marcarFavorito(id: string, isFavorite: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/favorito`, isFavorite);
  }

  puntuar(id: string, rating: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/rating`, rating);
  }
}
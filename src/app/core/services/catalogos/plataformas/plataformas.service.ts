import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { Observable } from 'rxjs';
import {
  ActualizarPlataformaDto,
  AgregarPlataformaDto,
  PlataformaDto,
} from '@core/models/plataformas.model';

@Injectable({
  providedIn: 'root',
})
export class PlataformasService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Platform`;

  obtenerPlataformas(
    filtoPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PlataformaDto[]> {
    let params: HttpParams = this.obtenerfiltro(filtoPaginado, pageNumber, pageSize);

    return this.http.get<PlataformaDto[]>(`${this.apiUrl}/paginado`, { params });
  }

  obtenerPlataformaPorId(id: string): Observable<PlataformaDto> {
    return this.http.get<PlataformaDto>(`${this.apiUrl}/${id}`);
  }

  agregarPlataforma(plataforma: AgregarPlataformaDto): Observable<PlataformaDto> {
    return this.http.post<PlataformaDto>(this.apiUrl, plataforma);
  }

  actualizarPlataforma(id: string, plataforma: ActualizarPlataformaDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, plataforma);
  }

  eliminarPlataforma(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private obtenerfiltro(filtro: FiltroGlobal, pageNumber: number, pageSize: number): HttpParams {
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
}

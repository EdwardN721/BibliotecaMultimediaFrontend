import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment.development';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { Observable } from 'rxjs';
import {
  ActualizarTipoMedioDto,
  AgregarTipoMedioDto,
  TipoMedioDto,
} from '@core/models/tipo.medios.model';

@Injectable({
  providedIn: 'root',
})
export class TipoMediosService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/MediaType`;

  obtenerTipoMedios(
    filtroPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<TipoMedioDto[]> {
    let params: HttpParams = this.obtenerFiltro(filtroPaginado, pageNumber, pageSize);

    return this.http.get<TipoMedioDto[]>(`${this.apiUrl}/paginado`, { params });
  }

  obtenerTipoMedioPorId(id: string): Observable<TipoMedioDto> {
    return this.http.get<TipoMedioDto>(`${this.apiUrl}/${id}`);
  }

  agregarTipoMedio(tipoMedio: AgregarTipoMedioDto): Observable<TipoMedioDto> {
    return this.http.post<TipoMedioDto>(this.apiUrl, tipoMedio);
  }

  actualizarTipoMedio(id: string, tipoMedio: ActualizarTipoMedioDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tipoMedio);
  }

  eliminarTipoMedio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private obtenerFiltro(
    filtroPaginado: FiltroGlobal,
    pageNumber: number,
    pageSize: number,
  ): HttpParams {
    let params: HttpParams = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (filtroPaginado.terminoBusqueda) {
      params = params.set('TerminoBusqueda', filtroPaginado.terminoBusqueda);
    }

    if (filtroPaginado.ordenadoPor) {
      params = params.set('OrdenarPor', filtroPaginado.ordenadoPor);
    }

    if (filtroPaginado.ordenDescendente !== undefined) {
      params = params.set('OrdenDescendente', filtroPaginado.ordenDescendente);
    }

    return params;
  }
}

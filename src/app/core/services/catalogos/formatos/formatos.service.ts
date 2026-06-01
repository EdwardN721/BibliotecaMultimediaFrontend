import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment.development';
import { ActualizarFormatoDto, AgregarFormatoDto, FormatosDto } from '@core/models/formatos.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormatosService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Format`;

  obtenerFormatos(
    filtroPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<FormatosDto[]> {
    let params: HttpParams = this.obtenerFiltro(filtroPaginado, pageNumber, pageSize);

    return this.http.get<FormatosDto[]>(`${this.apiUrl}/paginado`, { params });
  }

  obtenerFormatoPorId(id: string): Observable<FormatosDto> {
    return this.http.get<FormatosDto>(`${this.apiUrl}/${id}`);
  }

  agregarFormato(formato: AgregarFormatoDto): Observable<FormatosDto> {
    return this.http.post<FormatosDto>(this.apiUrl, formato);
  }

  actualizarFormato(id: string, formato: ActualizarFormatoDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formato);
  }

  eliminarFormato(id: string): Observable<void> {
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

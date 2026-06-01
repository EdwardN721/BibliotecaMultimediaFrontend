import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActualizarCreadorDto, AgregarCreadorDto, CreadorDto } from '@core/models/creadores.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreadoresService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Creator`

  obtenerCreadores(
    filtroPaginado: FiltroGlobal,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<CreadorDto[]>{
    let params: HttpParams = this.obtenerFiltro(filtroPaginado, pageNumber, pageSize);

    return this.http.get<CreadorDto[]>(`${this.apiUrl}/paginado`, { params });
  }

  obtenerCreadorPorId(id: string): Observable<CreadorDto>{
    return this.http.get<CreadorDto>(`${this.apiUrl}/${id}`);
  }

  agregarCreador(creador: AgregarCreadorDto): Observable<CreadorDto>{
    return this.http.post<CreadorDto>(this.apiUrl, creador);
  }

  actualizarCreador(id: string, creador: ActualizarCreadorDto): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${id}`, creador);
  }

  eliminarCreador(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private obtenerFiltro(filtroPaginado: FiltroGlobal, pageNumber: number, pageSize: number) : HttpParams {
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

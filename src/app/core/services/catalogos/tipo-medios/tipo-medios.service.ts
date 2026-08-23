import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';
import { leerMetadataPaginada } from '@core/utils/paginacion-metadata';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ActualizarTipoMedioDto,
  AgregarTipoMedioDto,
  TipoMedioDto,
} from '@core/models/tipo.medios.model';
import { RespuestaPaginada } from '@core/models/paginacion.model';

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
  ): Observable<RespuestaPaginada<TipoMedioDto>> {
    const params: HttpParams = buildPaginationParams(filtroPaginado, pageNumber, pageSize);

    return this.http.get<TipoMedioDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' }).pipe(
      map((respuesta) => ({
        registros: respuesta.body ?? [],
        metadata: leerMetadataPaginada(respuesta),
      })),
    );
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
}

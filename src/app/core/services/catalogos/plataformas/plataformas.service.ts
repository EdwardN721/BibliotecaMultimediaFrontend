import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ActualizarPlataformaDto,
  AgregarPlataformaDto,
  PlataformaDto,
} from '@core/models/plataformas.model';
import { RespuestaPaginada } from '@core/models/paginacion.model';
import { leerMetadataPaginada } from '@core/utils/paginacion-metadata';

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
  ): Observable<RespuestaPaginada<PlataformaDto>> {
    const params: HttpParams = buildPaginationParams(filtoPaginado, pageNumber, pageSize);

    return this.http.get<PlataformaDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' }).pipe(
      map((respuesta) => ({
        registros: respuesta.body ?? [],
        metadata: leerMetadataPaginada(respuesta),
      })),
    );
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
}

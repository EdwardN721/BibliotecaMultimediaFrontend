import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';
import { leerMetadataPaginada } from '@core/utils/paginacion-metadata';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActualizarFormatoDto, AgregarFormatoDto, FormatosDto } from '@core/models/formatos.model';
import { RespuestaPaginada } from '@core/models/paginacion.model';

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
  ): Observable<RespuestaPaginada<FormatosDto>> {
    const params: HttpParams = buildPaginationParams(filtroPaginado, pageNumber, pageSize);

    return this.http.get<FormatosDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' }).pipe(
      map((respuesta) => ({
        registros: respuesta.body ?? [],
        metadata: leerMetadataPaginada(respuesta),
      })),
    );
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
}

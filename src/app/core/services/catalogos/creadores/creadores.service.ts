import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActualizarCreadorDto, AgregarCreadorDto, CreadorDto } from '@core/models/creadores.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { buildPaginationParams } from '@core/utils/paginacion-params';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RespuestaPaginada } from '@core/models/paginacion.model';
import { leerMetadataPaginada } from '@core/utils/paginacion-metadata';

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
  ): Observable<RespuestaPaginada<CreadorDto>>{
    const params: HttpParams = buildPaginationParams(filtroPaginado, pageNumber, pageSize);

    return this.http.get<CreadorDto[]>(`${this.apiUrl}/paginado`, { params, observe: 'response' }).pipe(
      map((respuesta) => ({
        registros: respuesta.body ?? [],
        metadata: leerMetadataPaginada(respuesta),
      })),
    );
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
}

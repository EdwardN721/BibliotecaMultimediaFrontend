import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ItemDto } from '@core/models/item.model';
import { FiltroItem } from '@core/models/filtoPaginado.model'
import { RespuestaPaginada } from '@core/models/paginacion.model'

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Item`

  obtenerItems(
    filtoPaginado: FiltroItem,
    pageNumber: number = 1, 
    pageSize: number = 10
  ): Observable<RespuestaPaginada<ItemDto>>{
    let params: HttpParams = this.obtenerfiltro(filtoPaginado, pageNumber, pageSize)
      
      return this.http.get<RespuestaPaginada<ItemDto>>
        (`${this.apiUrl}/paginado`, { params });
  }

  obtenerItemPorId(id: string): Observable<ItemDto> {
    return this.http.get<ItemDto>(`${this.apiUrl}/${id}`);
  }

  private obtenerfiltro(filtro: FiltroItem, pageNumber: number, pageSize: number) : HttpParams {
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


import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { RespuestaPaginada } from '../../models/paginacion.model';
import { ItemDto } from '../../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/Item`

  obtenerItems(
    terminoBusqueda: string = "", 
    ordenarPor: string = "",
    ordenDescendente: boolean = true,
    pageNumber: number = 1, 
    pageSize: number = 10
  ): Observable<ItemDto[]>{
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('terminoBusqueda', terminoBusqueda)
      .set('OrdenarPor', ordenarPor)
      .set('OrdenDescendente', ordenDescendente);
      
      return this.http.get<ItemDto[]>
        (`${this.apiUrl}/paginado`, { params });
  }

}


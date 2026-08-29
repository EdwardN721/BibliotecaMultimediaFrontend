import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { ImagenItemDto } from '@core/models/item.model';

const TAMANIO_CHUNK = 1024 * 1024; // 1 MB por fragmento

interface RespuestaUploadChunkDto {
  cargaCompletada: boolean;
  mensaje: string;
  urlFinal?: string;
  /** Id de la imagen consolidada (null mientras la carga sigue en progreso) */
  imagenId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItemImagesService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/api/v1/ItemImages`;

  obtenerPorItem(itemId: string): Observable<ImagenItemDto[]> {
    return this.http.get<ImagenItemDto[]>(`${this.apiUrl}/item/${itemId}`);
  }

  eliminarImagen(imagenId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${imagenId}`);
  }

  marcarPrincipal(imagenId: string): Observable<ImagenItemDto> {
    return this.http.put<ImagenItemDto>(`${this.apiUrl}/${imagenId}/principal`, {});
  }

  /**
   * Sube un archivo por fragmentos (mismo contrato que el backend:
   * POST con formData chunk/fileName/chunkIndex/totalChunks).
   * onProgreso emite el porcentaje de avance (0-100).
   */
  async subirImagen(
    itemId: string,
    file: File,
    onProgreso?: (porcentaje: number) => void,
  ): Promise<ImagenItemDto | undefined> {
    const totalChunks: number = Math.max(1, Math.ceil(file.size / TAMANIO_CHUNK));
    let urlFinal: string | undefined;

    for (let indice = 0; indice < totalChunks; indice++) {
      const inicio: number = indice * TAMANIO_CHUNK;
      const fin: number = Math.min(inicio + TAMANIO_CHUNK, file.size);
      const chunk: Blob = file.slice(inicio, fin);

      const respuesta: RespuestaUploadChunkDto = await firstValueFrom(
        this.subirChunk(itemId, chunk, file.name, indice, totalChunks),
      ) as RespuestaUploadChunkDto;

      if (respuesta.cargaCompletada) {
        urlFinal = respuesta.urlFinal;
      }

      onProgreso?.(Math.round(((indice + 1) / totalChunks) * 100));
    }

    // Recuperamos la imagen registrada (incluye su Id) por la URL final
    const imagenes: ImagenItemDto[] = await firstValueFrom(this.obtenerPorItem(itemId));
    return imagenes.find((i) => i.imageUrl === urlFinal) ?? imagenes[0];
  }

  private subirChunk(itemId: string, chunk: Blob, fileName: string, chunkIndex: number, totalChunks: number): Observable<RespuestaUploadChunkDto> {
    const formData: FormData = new FormData();
    formData.append('chunk', chunk, `${chunkIndex}.part`);
    formData.append('fileName', fileName);
    formData.append('chunkIndex', String(chunkIndex));
    formData.append('totalChunks', String(totalChunks));

    return this.http.post<RespuestaUploadChunkDto>(`${this.apiUrl}/${itemId}`, formData);
  }
}

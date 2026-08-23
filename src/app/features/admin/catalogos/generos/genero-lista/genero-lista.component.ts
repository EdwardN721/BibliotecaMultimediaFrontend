import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { GeneroDto } from '@core/models/generos.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { ListaCatalogoBase } from '@shared/admin/catalogos/lista-catalogo.base';

@Component({
  selector: 'app-genero-lista',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    TableModule,
    RouterModule,
    FechaCdmxPipe,
    Tooltip,
  ],
  templateUrl: './genero-lista.component.html',
  styleUrl: './genero-lista.component.css',
})
export class GeneroListaComponent extends ListaCatalogoBase<GeneroDto> {
  private generoService = inject(GenerosService);

  protected override nombreEntidad = 'género';

  protected cargarDesdeServicio(filtro: FiltroGlobal, pagina: number, tamanio: number) {
    return this.generoService.obtenerGeneros(filtro, pagina, tamanio);
  }

  protected eliminarEnServicio(id: string) {
    return this.generoService.eliminarGenero(id);
  }
}

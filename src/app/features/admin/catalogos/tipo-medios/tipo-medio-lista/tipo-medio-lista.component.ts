import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { TipoMedioDto } from '@core/models/tipo.medios.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { ListaCatalogoBase } from '@shared/admin/catalogos/lista-catalogo.base';

@Component({
  selector: 'app-tipo-medio-lista',
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
  templateUrl: './tipo-medio-lista.component.html',
  styleUrl: './tipo-medio-lista.component.css',
})
export class TipoMedioListaComponent extends ListaCatalogoBase<TipoMedioDto> {
  private tipoMediosService = inject(TipoMediosService);

  protected override nombreEntidad = 'tipo de medio';

  protected cargarDesdeServicio(filtro: FiltroGlobal, pagina: number, tamanio: number) {
    return this.tipoMediosService.obtenerTipoMedios(filtro, pagina, tamanio);
  }

  protected eliminarEnServicio(id: string) {
    return this.tipoMediosService.eliminarTipoMedio(id);
  }
}

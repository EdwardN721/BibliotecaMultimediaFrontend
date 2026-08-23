import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { CreadorDto } from '@core/models/creadores.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { ListaCatalogoBase } from '@shared/admin/catalogos/lista-catalogo.base';

@Component({
  selector: 'app-creadores-lista',
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
  templateUrl: './creadores-list.component.html',
  styleUrl: './creadores-list.component.css',
})
export class CreadoresListComponent extends ListaCatalogoBase<CreadorDto> {
  private creadoresService = inject(CreadoresService);

  protected override nombreEntidad = 'creador';

  protected cargarDesdeServicio(filtro: FiltroGlobal, pagina: number, tamanio: number) {
    return this.creadoresService.obtenerCreadores(filtro, pagina, tamanio);
  }

  protected eliminarEnServicio(id: string) {
    return this.creadoresService.eliminarCreador(id);
  }
}

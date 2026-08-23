import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { Tooltip } from 'primeng/tooltip';
import { FormatosDto } from '@core/models/formatos.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { ListaCatalogoBase } from '@shared/admin/catalogos/lista-catalogo.base';

@Component({
  selector: 'app-formato-lista',
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
  templateUrl: './formato-lista.component.html',
  styleUrl: './formato-lista.component.css',
})
export class FormatoListaComponent extends ListaCatalogoBase<FormatosDto> {
  private formatoService = inject(FormatosService);

  protected override nombreEntidad = 'formato';

  protected cargarDesdeServicio(filtro: FiltroGlobal, pagina: number, tamanio: number) {
    return this.formatoService.obtenerFormatos(filtro, pagina, tamanio);
  }

  protected eliminarEnServicio(id: string) {
    return this.formatoService.eliminarFormato(id);
  }
}

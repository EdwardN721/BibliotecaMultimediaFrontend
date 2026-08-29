import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { PlataformaDto } from '@core/models/plataformas.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { ListaCatalogoBase } from '@shared/admin/catalogos/lista-catalogo.base';

@Component({
  selector: 'app-plataformas-lista',
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
  templateUrl: './plataformas.component.html',
  styleUrl: './plataformas.component.css',
})
export class PlataformaListaComponent extends ListaCatalogoBase<PlataformaDto> {
  private plataformasService = inject(PlataformasService);

  protected override nombreEntidad = 'plataforma';

  protected cargarDesdeServicio(filtro: FiltroGlobal, pagina: number, tamanio: number) {
    return this.plataformasService.obtenerPlataformas(filtro, pagina, tamanio);
  }

  protected eliminarEnServicio(id: string) {
    return this.plataformasService.eliminarPlataforma(id);
  }
}

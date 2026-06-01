import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { TipoMedioDto } from '@core/models/tipo.medios.model';

@Component({
  selector: 'app-tipo-medio-lista.component',
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
export class TipoMedioListaComponent implements OnInit {
  private tipoMedioService: TipoMediosService = inject(TipoMediosService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  tipoMedios: WritableSignal<TipoMedioDto[]> = signal<TipoMedioDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit() {
    this.cargarFormatos();
  }

  cargarFormatos() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: '',
      ordenDescendente: true,
    };

    this.tipoMedioService.obtenerTipoMedios(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.tipoMedios.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los medios:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener',
          detail: 'Ocurrio un error al cargar la información',
        });
        this.errorMessage.set('No se pudo recuperar el cátalogo de tipo medios');
        this.isLoading.set(false);
      },
    });
  }

  eliminar(id: string, nombre: string) {
    this.confirmationService.confirm({
      message: `¿Desea eliminar ${nombre} permanentemente?`,
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tipoMedioService.eliminarTipoMedio(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `"${nombre}" fue eliminado`,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar',
              detail: 'No se pudo eliminar',
            });
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { FormatosDto } from '@core/models/formatos.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { Tooltip } from 'primeng/tooltip';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { PaginacionMetadata } from '@core/models/paginacion.model';

const METADATA_VACIA: PaginacionMetadata = {
  paginaActual: 1,
  totalPaginas: 0,
  registrosPorPagina: 10,
  totalRegistros: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

@Component({
  selector: 'app-formato-lista.component',
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
export class FormatoListaComponent implements OnInit {
  private formatoService: FormatosService = inject(FormatosService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private notificacion: NotificacionService = inject(NotificacionService);

  formatos: WritableSignal<FormatosDto[]> = signal<FormatosDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  metadata: WritableSignal<PaginacionMetadata> = signal<PaginacionMetadata>({ ...METADATA_VACIA });

  paginaActual = signal(1);
  tamanioPagina = signal(10);
  campoOrden = signal('');
  ordenDescendente = signal(true);

  ngOnInit() {
    this.cargarFormatos();
  }

  cargarFormatos() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: this.campoOrden(),
      ordenDescendente: this.ordenDescendente(),
    };

    this.formatoService.obtenerFormatos(miFiltro, this.paginaActual(), this.tamanioPagina()).subscribe({
      next: (respuesta) => {
        this.formatos.set(respuesta.registros);
        this.metadata.set(respuesta.metadata);
        this.notificacion.exito('¡Éxito!',  `Éxito al cargar los formatos.`);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los formatos:', err);
        this.notificacion.error('Error al obtener', 'Ocurrio un error al cargar la información');
        this.errorMessage.set('No se pudo recuperar el cátalogo de formatos');
        this.isLoading.set(false);
      },
    });
  }

  alCambiarPagina(evento: { first?: number; rows?: number }) {
    if (!evento.rows) return;
    this.tamanioPagina.set(evento.rows);
    this.paginaActual.set(Math.floor((evento.first ?? 0) / evento.rows) + 1);
    this.cargarFormatos();
  }

  alOrdenar(evento: { field?: string; order?: number }) {
    if (!evento.field) return;
    this.campoOrden.set(evento.field);
    this.ordenDescendente.set(evento.order !== 1);
    this.paginaActual.set(1);
    this.cargarFormatos();
  }

  eliminar(id: string, nombre: string) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar a "${nombre}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle text-red-500 text-2xl mr-2',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass:
        'p-button-text px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-all',
      acceptButtonStyleClass:
        'px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white border-none rounded-xl shadow-lg shadow-red-600/30 hover:-translate-y-0.5 transition-all font-bold ml-3',

      accept: () => {
        this.formatoService.eliminarFormato(id).subscribe({
          next: () => {
            this.notificacion.info('Eliminado', `"${nombre}" fue eliminado exitosamente`);
            if (this.formatos().length === 1 && this.paginaActual() > 1) {
              this.paginaActual.update((p) => p - 1);
            }
            this.cargarFormatos();
          },
          error: (err) => {
            this.notificacion.exito(
              'Operación denegada',
              'No se pudo eliminar el formato.',
            );
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

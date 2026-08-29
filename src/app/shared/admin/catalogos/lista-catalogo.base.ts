import { Directive, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { PaginacionMetadata, RespuestaPaginada } from '@core/models/paginacion.model';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { LoggerService } from '@core/services/logger/logger.service';

export const METADATA_VACIA: PaginacionMetadata = {
  paginaActual: 1,
  totalPaginas: 0,
  registrosPorPagina: 10,
  totalRegistros: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

/**
 * Lógica común de las listas de catálogos del admin (paginación, orden,
 * eliminación con confirmación y notificaciones).
 *
 * Cada catálogo declara su servicio mediante los miembros abstractos.
 */
@Directive()
export abstract class ListaCatalogoBase<T extends { id: string }> implements OnInit {
  private confirmationService = inject(ConfirmationService);
  protected notificacion = inject(NotificacionService);
  protected logger = inject(LoggerService);

  /** Nombre legible de la entidad para los mensajes ("formato", "género"...). */
  protected abstract nombreEntidad: string;
  protected abstract cargarDesdeServicio(
    filtro: FiltroGlobal,
    pagina: number,
    tamanio: number,
  ): Observable<RespuestaPaginada<T>>;
  protected abstract eliminarEnServicio(id: string): Observable<void>;

  items: WritableSignal<T[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal(null);
  metadata: WritableSignal<PaginacionMetadata> = signal({ ...METADATA_VACIA });

  paginaActual = signal(1);
  tamanioPagina = signal(10);
  campoOrden = signal('');
  ordenDescendente = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.isLoading.set(true);

    const filtro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: this.campoOrden(),
      ordenDescendente: this.ordenDescendente(),
    };

    this.cargarDesdeServicio(filtro, this.paginaActual(), this.tamanioPagina()).subscribe({
      next: (respuesta) => {
        this.items.set(respuesta.registros);
        this.metadata.set(respuesta.metadata);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error(`lista-${this.nombreEntidad}`, `Error al cargar los ${this.nombreEntidad}:`, err);
        this.notificacion.error('Error al obtener', 'Ocurrió un error al cargar la información');
        this.errorMessage.set(`No se pudo recuperar el catálogo de ${this.nombreEntidad}`);
        this.isLoading.set(false);
      },
    });
  }

  alCambiarPagina(evento: { first?: number; rows?: number }): void {
    if (!evento.rows) return;
    this.tamanioPagina.set(evento.rows);
    this.paginaActual.set(Math.floor((evento.first ?? 0) / evento.rows) + 1);
    this.cargar();
  }

  alOrdenar(evento: { field?: string; order?: number }): void {
    if (!evento.field) return;
    this.campoOrden.set(evento.field);
    this.ordenDescendente.set(evento.order !== 1);
    this.paginaActual.set(1);
    this.cargar();
  }

  eliminar(id: string, nombre: string): void {
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
        this.eliminarEnServicio(id).subscribe({
          next: () => {
            this.notificacion.info('Eliminado', `"${nombre}" fue eliminado exitosamente`);
            if (this.items().length === 1 && this.paginaActual() > 1) {
              this.paginaActual.update((p) => p - 1);
            }
            this.cargar();
          },
          error: (err) => {
            this.notificacion.error(
              'Operación denegada',
              `No se pudo eliminar el ${this.nombreEntidad}.`,
            );
            this.logger.error(`lista-${this.nombreEntidad}`, 'Error al eliminar:', err);
          },
        });
      },
    });
  }
}

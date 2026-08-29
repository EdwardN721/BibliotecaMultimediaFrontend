import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ItemService } from '@core/services/items/item.service';
import { ItemDto } from '@core/models/item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoggerService } from '@core/services/logger/logger.service';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  private itemService: ItemService = inject(ItemService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private logger: LoggerService = inject(LoggerService);

  items: WritableSignal<ItemDto[]> = signal<ItemDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  totalRecords: WritableSignal<number> = signal(0);
  rows: WritableSignal<number> = signal(10);
  terminoBusqueda: WritableSignal<string> = signal('');

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: this.terminoBusqueda(),
      ordenadoPor: '',
      ordenDescendente: true,
    };

    this.itemService.obtenerItems(miFiltro, 1, this.rows()).subscribe({
      next: (respuesta) => {
        this.items.set(respuesta.registros);
        this.totalRecords.set(respuesta.metadata.totalRegistros);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.logger.error('items', 'Error al cargar el catálogo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
          styleClass: 'p-2 rounded-2xl shadow-xl',
        });
        this.errorMessage.set('No se pudo recuperar el catálogo de ítems.');
        this.isLoading.set(false);
      },
    });
  }

  buscar() {
    this.cargarCatalogo();
  }

  onPageChange(event: TableLazyLoadEvent) {
    const pageSize = event.rows ?? 10;
    const first = event.first ?? 0;
    this.rows.set(pageSize);

    const campoOrden = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    const miFiltro: FiltroGlobal = {
      terminoBusqueda: this.terminoBusqueda(),
      ordenadoPor: campoOrden ?? '',
      ordenDescendente: event.sortOrder === -1,
    };

    this.itemService.obtenerItems(miFiltro, Math.floor(first / pageSize) + 1, pageSize).subscribe({
      next: (respuesta) => {
        this.items.set(respuesta.registros);
        this.totalRecords.set(respuesta.metadata.totalRegistros);
      },
      error: (err) => {
        this.logger.error('items', 'Error al cargar la página:', err);
      },
    });
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
        this.itemService.eliminarItem(id).subscribe({
          next: () => {
            this.items.update((lista) => lista.filter((c) => c.id !== id));
            this.totalRecords.update((t) => Math.max(0, t - 1));

            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `"${nombre}" fue eliminado exitosamente`,
              styleClass: 'p-2 rounded-2xl shadow-xl',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación denegada',
              detail: 'No se pudo eliminar el item. Verifica tu conexión.',
              styleClass: 'p-2 rounded-2xl shadow-xl',
            });
            this.logger.error('items', 'Error al eliminar:', err);
          },
        });
      },
    });
  }
}

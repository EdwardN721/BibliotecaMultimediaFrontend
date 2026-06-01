import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ItemService } from '@core/services/items/item.service';
import { ItemDto } from '@core/models/item.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-items.component',
  imports: [
    CommonModule,
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

  items: WritableSignal<ItemDto[]> = signal<ItemDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: '',
      ordenDescendente: true,
    };

    this.itemService.obtenerItems(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.items.set(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Éxito al cargar los articulos.`,
          styleClass: 'p-2 rounded-2xl shadow-xl',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
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
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

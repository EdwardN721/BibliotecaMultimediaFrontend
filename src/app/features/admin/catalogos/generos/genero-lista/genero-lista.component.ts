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
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { GeneroDto } from '@core/models/generos.model';

@Component({
  selector: 'app-genero-lista.component',
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
export class GeneroListaComponent implements OnInit {
  private generoService: GenerosService = inject(GenerosService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  generos: WritableSignal<GeneroDto[]> = signal<GeneroDto[]>([]);
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

    this.generoService.obtenerGeneros(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.generos.set(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Éxito al cargar los generos.`,
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los generos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener',
          detail: 'Ocurrio un error al cargar la información',
        });
        this.errorMessage.set('No se pudo recuperar el cátalogo de generos');
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
        this.generoService.eliminarGenero(id).subscribe({
          next: () => {
            this.generos.update((lista) => lista.filter((c) => c.id !== id));

            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `"${nombre}" fue eliminado exitosamente`,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación denegada',
              detail: 'No se pudo eliminar el genero. Verifica tu conexión.',
            });
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

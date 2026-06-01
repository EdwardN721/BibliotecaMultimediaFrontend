import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { CreadorDto } from '@core/models/creadores.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { ConfirmationService } from  'primeng/api';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';

import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

@Component({
  selector: 'app-creadores-list.component',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    TableModule,
    RouterModule,
    FechaCdmxPipe,
  ],
  templateUrl: './creadores-list.component.html',
  styleUrl: './creadores-list.component.css',
})
export class CreadoresListComponent implements OnInit {
  private creadorService: CreadoresService = inject(CreadoresService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private notificacion: NotificacionService = inject(NotificacionService);

  creadores: WritableSignal<CreadorDto[]> = signal<CreadorDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit() {
    this.cargarCreadores();
  }

  cargarCreadores() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: '',
      ordenDescendente: true,
    };

    this.creadorService.obtenerCreadores(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.creadores.set(response);
        this.notificacion.exito('Éxito', `Éxito al cargar los creadores.`);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar a los creadores:', err);
        this.notificacion.error(
          'Error al obtener',
          'Ocurrió un error de comunicación con el servidor',
        );
        this.errorMessage.set('No se pudo recuperar el cátalogo de creadores');
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
        this.creadorService.eliminarCreador(id).subscribe({
          next: () => {
            this.creadores.update((lista) => lista.filter((c) => c.id !== id));

            this.notificacion.exito('Eliminado', `"${nombre}" fue eliminado exitosamente`);
          },
          error: (err) => {
            this.notificacion.error(
              'Operación denegada',
              'No se pudo eliminar el creador.',
            );
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

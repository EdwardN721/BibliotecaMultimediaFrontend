import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { PlataformaDto } from '@core/models/plataformas.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

@Component({
  selector: 'app-plataformas.componetn',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ToastModule,
    FechaCdmxPipe,
    ConfirmDialogModule,
    Tooltip,
  ],
  templateUrl: './plataformas.component.html',
  styleUrl: './plataformas.component.css',
})
export class PlataformasComponent implements OnInit {
  private plataformaService: PlataformasService = inject(PlataformasService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private notificacion: NotificacionService = inject(NotificacionService);

  plataformas: WritableSignal<PlataformaDto[]> = signal<PlataformaDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit() {
    this.cargarPlataformas();
  }

  cargarPlataformas() {
    this.isLoading.set(true);

    const miFiltro: FiltroGlobal = {
      terminoBusqueda: '',
      ordenadoPor: '',
      ordenDescendente: true,
    };

    this.plataformaService.obtenerPlataformas(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.plataformas.set(response);
        this.notificacion.exito('Éxito al obtener', `Éxito al cargar plataformas.`);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.notificacion.error(
          'No se pudo cargar las plataformas',
          'Ocurrió un error de comunicación con el servidor.',
        );
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
        this.plataformaService.eliminarPlataforma(id).subscribe({
          next: () => {
            this.plataformas.update((lista) => lista.filter((c) => c.id !== id));
            this.notificacion.exito('Eliminado', `"${nombre}" fue eliminado exitosamente`);
          },
          error: (err) => {
            this.notificacion.error(
              'Operación denegada',
              'No se pudo eliminar la plataforma.',
            );
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

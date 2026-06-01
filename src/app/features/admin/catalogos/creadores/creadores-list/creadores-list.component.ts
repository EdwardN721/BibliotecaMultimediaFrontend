import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { CreadorDto } from '@core/models/creadores.model';
import { FiltroGlobal } from '@core/models/filtoPaginado.model';
import { ConfirmationService, MessageService } from  'primeng/api';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';

import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

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
    FechaCdmxPipe
  ],
  templateUrl: './creadores-list.component.html',
  styleUrl: './creadores-list.component.css',
})
export class CreadoresListComponent implements OnInit {
  private creadorService: CreadoresService = inject(CreadoresService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

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
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar a los creadores:', err);
        this.errorMessage.set('No se pudo recuperar el cátalogo de creadores');
        this.isLoading.set(false);
      },
    });
  }

  eliminar(id: string, nombre: string) {
    this.confirmationService.confirm({
      message: `¿Desea eliminar${nombre} permanentemente?`,
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.creadorService.eliminarCreador(id).subscribe({
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
              summary: 'Error',
              detail: 'No se pudo eliminar',
            });
            console.error('Error al eliminar:', err);
          },
        });
      },
    });
  }
}

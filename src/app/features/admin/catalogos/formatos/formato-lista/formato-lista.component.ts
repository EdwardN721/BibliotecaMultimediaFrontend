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
  private messageService: MessageService = inject(MessageService);

  formatos: WritableSignal<FormatosDto[]> = signal<FormatosDto[]>([]);
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

    this.formatoService.obtenerFormatos(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.formatos.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los formatos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener',
          detail: 'Ocurrio un error al cargar la información',
        });
        this.errorMessage.set('No se pudo recuperar el cátalogo de formatos');
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
        this.formatoService.eliminarFormato(id).subscribe({
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

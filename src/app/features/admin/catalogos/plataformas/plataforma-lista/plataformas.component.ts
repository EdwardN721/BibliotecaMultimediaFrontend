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
import { ConfirmationService, MessageService } from 'primeng/api';
import { FechaCdmxPipe } from '@shared/pipe/fecha-cdmx.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  ],
  templateUrl: './plataformas.component.html',
  styleUrl: './plataformas.component.css',
})
export class PlataformasComponent implements OnInit {
  private plataformaService: PlataformasService = inject(PlataformasService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  items: WritableSignal<PlataformaDto[]> = signal<PlataformaDto[]>([]);
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

    this.plataformaService.obtenerItems(miFiltro, 1, 10).subscribe({
      next: (response) => {
        this.items.set(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Éxito al cargar plataformas.`,
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cargar las plataformas',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.errorMessage.set('No se pudo recuperar el catálogo de ítems.');
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
        this.plataformaService.eliminarPlataforma(id).subscribe({
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

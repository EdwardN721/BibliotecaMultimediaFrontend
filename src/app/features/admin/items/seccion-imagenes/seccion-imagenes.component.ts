import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { ItemImagesService } from '@core/services/items/item-images.service';
import { ImagenItemDto } from '@core/models/item.model';

@Component({
  selector: 'app-seccion-imagenes',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ProgressBarModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './seccion-imagenes.component.html',
  styleUrl: './seccion-imagenes.component.css',
})
export class SeccionImagenesComponent {
  itemId = input.required<string>();

  private itemImagesService: ItemImagesService = inject(ItemImagesService);
  private notificacion: NotificacionService = inject(NotificacionService);
  private confirmation: ConfirmationService = inject(ConfirmationService);

  imagenes: WritableSignal<ImagenItemDto[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  isSubiendo: WritableSignal<boolean> = signal(false);
  progreso: WritableSignal<number> = signal(0);

  constructor() {
    // Carga inicial y recarga cuando el ítem esté disponible
    effect(() => {
      const id = this.itemId();
      if (id) {
        this.cargarImagenes(id);
      }
    });
  }

  cargarImagenes(id: string = this.itemId()): void {
    this.isLoading.set(true);
    this.itemImagesService.obtenerPorItem(id).subscribe({
      next: (imagenes) => {
        this.imagenes.set(imagenes);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificacion.error('Error al cargar', 'No se pudieron recuperar las imágenes del ítem.');
        this.isLoading.set(false);
      },
    });
  }

  async alSeleccionarArchivos(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivos: FileList | null = input.files;
    if (!archivos || archivos.length === 0) return;

    this.isSubiendo.set(true);
    this.progreso.set(0);

    let exitosas = 0;
    let fallidas = 0;

    for (const archivo of Array.from(archivos)) {
      try {
        await this.itemImagesService.subirImagen(this.itemId(), archivo, (p) =>
          this.progreso.set(Math.max(this.progreso(), p)),
        );
        exitosas++;
      } catch {
        fallidas++;
        this.notificacion.error('Error al subir', `No se pudo subir "${archivo.name}".`);
      }
    }

    this.isSubiendo.set(false);
    this.progreso.set(0);
    input.value = '';
    this.cargarImagenes();

    if (exitosas > 0 && fallidas === 0) {
      this.notificacion.exito('Imágenes subidas', 'Las imágenes se agregaron al ítem.');
    } else if (exitosas > 0) {
      this.notificacion.info('Subida parcial', `${exitosas} imagen(es) subidas, ${fallidas} con error.`);
    }
  }

  marcarPrincipal(imagen: ImagenItemDto): void {
    if (imagen.isPrimary) return;
    this.itemImagesService.marcarPrincipal(imagen.id).subscribe({
      next: () => this.cargarImagenes(),
      error: () => this.notificacion.error('Error', 'No se pudo marcar la imagen como principal.'),
    });
  }

  eliminar(imagen: ImagenItemDto, event: Event): void {
    this.confirmation.confirm({
      target: event.target ?? undefined,
      message: '¿Eliminar esta imagen definitivamente?',
      header: 'Eliminar imagen',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.itemImagesService.eliminarImagen(imagen.id).subscribe({
          next: () => this.cargarImagenes(),
          error: () => this.notificacion.error('Error', 'No se pudo eliminar la imagen.'),
        });
      },
    });
  }
}

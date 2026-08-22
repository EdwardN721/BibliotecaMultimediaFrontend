import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ItemService } from '@core/services/items/item.service';
import { BibliotecaService } from '@core/services/biblioteca/biblioteca.service';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { ItemDto } from '@core/models/item.model';
import {
  CONSUMPTION_STATUS_LABELS,
  ConsumptionStatus,
  PeticionAgregarABibliotecaDto,
  PeticionActualizarUserItemDto,
  RespuestaUserItemDto,
} from '@core/models/biblioteca.model';

@Component({
  selector: 'app-detalle-titulo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './detalle-titulo.html',
  styleUrl: './detalle-titulo.css',
})
export class DetalleTitulo {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private itemService: ItemService = inject(ItemService);
  private bibliotecaService: BibliotecaService = inject(BibliotecaService);
  private notificacion: NotificacionService = inject(NotificacionService);
  private confirmation: ConfirmationService = inject(ConfirmationService);

  readonly statusOptions = Object.entries(CONSUMPTION_STATUS_LABELS).map(([valor, etiqueta]) => ({
    valor: valor as ConsumptionStatus,
    etiqueta,
  }));

  item: WritableSignal<ItemDto | null> = signal(null);
  userItem: WritableSignal<RespuestaUserItemDto | null> = signal(null);
  cargando: WritableSignal<boolean> = signal(true);

  nuevoStatus: ConsumptionStatus = ConsumptionStatus.Pendiente;
  guardando: WritableSignal<boolean> = signal(false);
  editandoProgreso: WritableSignal<boolean> = signal(false);
  progresoTemporal: string = '';

  readonly enBiblioteca = computed(() => this.userItem() !== null);

  readonly anio = computed(() => {
    const fecha = this.item()?.releaseDate;
    return fecha ? new Date(fecha).getFullYear() : null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/user']);
      return;
    }

    this.itemService.obtenerItemPorId(id).subscribe({
      next: (item) => {
        this.item.set(item);
        this.cargando.set(false);
      },
      error: () => {
        this.notificacion.error('No encontrado', 'El título solicitado no existe.');
        this.router.navigate(['/user']);
      },
    });

    this.bibliotecaService.obtenerBiblioteca({}, 1, 200).subscribe({
      next: (respuesta) => {
        const encontrado = respuesta.registros.find((r) => r.itemId === id) ?? null;
        if (encontrado) {
          this.userItem.set(encontrado);
          this.nuevoStatus = encontrado.status;
        }
      },
      error: () => {},
    });
  }

  get statusActualLabel(): string {
    const ui = this.userItem();
    return ui ? CONSUMPTION_STATUS_LABELS[ui.status] ?? '' : '';
  }

  agregarABiblioteca() {
    const item = this.item();
    if (!item) return;

    const dto: PeticionAgregarABibliotecaDto = {
      itemId: item.id,
      status: this.nuevoStatus,
      isFavorite: false,
      isPrivate: false,
    };

    this.guardando.set(true);
    this.bibliotecaService.agregarABiblioteca(dto).subscribe({
      next: (creado) => {
        this.userItem.set(creado);
        this.guardando.set(false);
        this.notificacion.exito('Agregado', `"${item.title}" se añadió a tu biblioteca.`);
      },
      error: (err) => {
        this.guardando.set(false);
        this.notificacion.error('Error', err.error?.detail ?? 'No se pudo agregar el título.');
      },
    });
  }

  cambiarStatus(status: ConsumptionStatus) {
    const ui = this.userItem();
    if (!ui || status === ui.status) return;

    const dto: PeticionActualizarUserItemDto = { status };
    this.guardando.set(true);
    this.bibliotecaService.actualizarItemDeBiblioteca(ui.id, dto).subscribe({
      next: () => {
        this.guardando.set(false);
        this.userItem.update((v) => (v ? { ...v, status } : v));

        if (status === ConsumptionStatus.EnProgreso && !ui.startedAt) {
          this.userItem.update((v) => (v ? { ...v, startedAt: new Date().toISOString() } : v));
        }
        if (status === ConsumptionStatus.Completado) {
          this.userItem.update((v) => (v ? { ...v, finishedAt: new Date().toISOString() } : v));
        }

        this.notificacion.exito('Estado actualizado', `Ahora está "${CONSUMPTION_STATUS_LABELS[status]}".`);
      },
      error: () => {
        this.guardando.set(false);
        this.notificacion.error('Error', 'No se pudo actualizar el estado.');
      },
    });
  }

  puntuar(rating: number) {
    const ui = this.userItem();
    if (!ui) return;

    this.bibliotecaService.puntuar(ui.id, rating).subscribe({
      next: () => {
        this.userItem.update((v) => (v ? { ...v, personalRating: rating } : v));
        this.notificacion.exito('Gracias', `Calificaste con ${rating} estrella${rating > 1 ? 's' : ''}.`);
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo registrar tu calificación.');
      },
    });
  }

  toggleFavorito() {
    const ui = this.userItem();
    if (!ui) return;

    const nuevo = !ui.isFavorite;
    this.bibliotecaService.marcarFavorito(ui.id, nuevo).subscribe({
      next: () => {
        this.userItem.update((v) => (v ? { ...v, isFavorite: nuevo } : v));
        this.notificacion.exito(
          nuevo ? 'Agregado a favoritos' : 'Quitado de favoritos',
          'Tu lista se actualizó.',
        );
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo actualizar el favorito.');
      },
    });
  }

  togglePrivado() {
    const ui = this.userItem();
    if (!ui) return;

    const nuevo = !ui.isPrivate;
    const dto: PeticionActualizarUserItemDto = { isPrivate: nuevo };
    this.bibliotecaService.actualizarItemDeBiblioteca(ui.id, dto).subscribe({
      next: () => {
        this.userItem.update((v) => (v ? { ...v, isPrivate: nuevo } : v));
        this.notificacion.exito(nuevo ? 'Ahora es privado' : 'Ahora es público', 'Preferencia guardada.');
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo cambiar la privacidad.');
      },
    });
  }

  iniciarEdicionProgreso() {
    const ui = this.userItem();
    if (!ui) return;
    this.progresoTemporal = ui.progress ?? '';
    this.editandoProgreso.set(true);
  }

  guardarProgreso() {
    const ui = this.userItem();
    if (!ui) return;

    const dto: PeticionActualizarUserItemDto = { progress: this.progresoTemporal || undefined };
    this.bibliotecaService.actualizarItemDeBiblioteca(ui.id, dto).subscribe({
      next: () => {
        this.userItem.update((v) => (v ? { ...v, progress: this.progresoTemporal || undefined } : v));
        this.editandoProgreso.set(false);
        this.notificacion.exito('Progreso guardado', '');
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo guardar el progreso.');
      },
    });
  }

  eliminar() {
    const ui = this.userItem();
    if (!ui) return;

    this.confirmation.confirm({
      header: 'Eliminar de mi biblioteca',
      message: `¿Seguro que quieres eliminar "${ui.titulo}" de tu biblioteca?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { label: 'Sí, eliminar', severity: 'danger' },
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary' },
      accept: () => {
        this.bibliotecaService.eliminarDeBiblioteca(ui.id).subscribe({
          next: () => {
            this.userItem.set(null);
            this.notificacion.exito('Eliminado', `"${ui.titulo}" se quitó de tu biblioteca.`);
          },
          error: () => {
            this.notificacion.error('Error', 'No se pudo eliminar el título.');
          },
        });
      },
    });
  }
}

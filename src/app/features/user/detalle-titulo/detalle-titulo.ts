import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

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
import { RespuestaPrestamoDto } from '@core/models/prestamo.model';

interface OpcionCopia {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-detalle-titulo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MultiSelectModule],
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
  /** true mientras no sabemos aún si el título está en la biblioteca del usuario */
  cargandoBiblioteca: WritableSignal<boolean> = signal(true);

  nuevoStatus: ConsumptionStatus = ConsumptionStatus.Pendiente;
  guardando: WritableSignal<boolean> = signal(false);
  editandoProgreso: WritableSignal<boolean> = signal(false);
  progresoTemporal: string = '';

  /** Copia propia del usuario: formatos y plataformas/consolas seleccionadas */
  formatosPropios: string[] = [];
  plataformasPropias: string[] = [];
  sincronizandoCopia: WritableSignal<boolean> = signal(false);

  /** Reseña personal */
  editandoResena: WritableSignal<boolean> = signal(false);
  resenaTemporal: string = '';
  guardandoResena: WritableSignal<boolean> = signal(false);

  /** Préstamos del título */
  prestamos: WritableSignal<RespuestaPrestamoDto[]> = signal([]);
  nuevoPrestamoNombre: string = '';
  nuevoPrestamoNotas: string = '';
  gestionandoPrestamo: WritableSignal<boolean> = signal(false);

  readonly enBiblioteca = computed(() => this.userItem() !== null);

  readonly anio = computed(() => {
    const fecha = this.item()?.releaseDate;
    return fecha ? new Date(fecha).getFullYear() : null;
  });

  /** Opciones de formatos del catálogo (id + nombre) para "mi copia" */
  readonly opcionesFormatos = computed<OpcionCopia[]>(() => {
    const it = this.item();
    if (!it) return [];
    return it.formatIds
      .map((id, i) => ({ id, nombre: it.formats[i] ?? '' }))
      .filter((o) => o.nombre !== '');
  });

  /** Opciones de plataformas/consolas del catálogo (id + nombre) para "mi copia" */
  readonly opcionesPlataformas = computed<OpcionCopia[]>(() => {
    const it = this.item();
    if (!it) return [];
    return it.platformIds
      .map((id, i) => ({ id, nombre: it.platforms[i] ?? '' }))
      .filter((o) => o.nombre !== '');
  });

  /** Etiqueta "Lo tengo en: X · Y" para la ficha */
  readonly copiaPropiaEtiqueta = computed(() => {
    const ui = this.userItem();
    if (!ui) return '';
    return [...(ui.ownedFormats ?? []), ...(ui.ownedPlatforms ?? [])].join(' · ');
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

    // Consulta directa y ligera: la API responde 204 si el título no está en la biblioteca
    this.bibliotecaService.obtenerEntradaPorItemId(id).subscribe({
      next: (entrada) => {
        if (entrada) {
          this.userItem.set(entrada);
          this.nuevoStatus = entrada.status;
          this.formatosPropios = [...(entrada.ownedFormatIds ?? [])];
          this.plataformasPropias = [...(entrada.ownedPlatformIds ?? [])];
          this.cargarPrestamos(entrada.id);
        }
        this.cargandoBiblioteca.set(false);
      },
      error: () => this.cargandoBiblioteca.set(false),
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

  /** Guarda en qué formatos/plataformas/consolas el usuario tiene el título */
  guardarCopiaPropia() {
    const ui = this.userItem();
    if (!ui) return;

    const dto: PeticionActualizarUserItemDto = {
      ownedFormatIds: this.formatosPropios,
      ownedPlatformIds: this.plataformasPropias,
    };
    this.sincronizandoCopia.set(true);
    this.bibliotecaService.actualizarItemDeBiblioteca(ui.id, dto).subscribe({
      next: () => {
        this.sincronizandoCopia.set(false);
        this.userItem.update((v) =>
          v
            ? {
                ...v,
                ownedFormatIds: [...this.formatosPropios],
                ownedPlatformIds: [...this.plataformasPropias],
                ownedFormats: this.nombresSeleccionados(this.opcionesFormatos(), this.formatosPropios),
                ownedPlatforms: this.nombresSeleccionados(this.opcionesPlataformas(), this.plataformasPropias),
              }
            : v,
        );
      },
      error: () => {
        this.sincronizandoCopia.set(false);
        this.notificacion.error('Error', 'No se pudo guardar tu copia.');
      },
    });
  }

  private nombresSeleccionados(opciones: OpcionCopia[], ids: string[]): string[] {
    return opciones.filter((o) => ids.includes(o.id)).map((o) => o.nombre);
  }

  // ===== Préstamos =====

  cargarPrestamos(userItemId: string) {
    this.bibliotecaService.obtenerPrestamos(userItemId).subscribe({
      next: (lista) => this.prestamos.set(lista),
      error: () => this.prestamos.set([]),
    });
  }

  private refrescarPrestamoActivo() {
    const activo = this.prestamos().find((p) => p.estaActivo);
    this.userItem.update((v) => (v ? { ...v, prestamoActivoA: activo?.nombrePersona ?? null } : v));
  }

  crearPrestamo() {
    const ui = this.userItem();
    const nombre = this.nuevoPrestamoNombre.trim();
    if (!ui || !nombre) return;

    const activo = this.prestamos().find((p) => p.estaActivo);
    if (activo) {
      this.notificacion.error('Ya está prestado', `"${ui.titulo}" sigue con ${activo.nombrePersona}.`);
      return;
    }

    this.gestionandoPrestamo.set(true);
    this.bibliotecaService
      .agregarPrestamo(ui.id, {
        nombrePersona: nombre,
        notas: this.nuevoPrestamoNotas.trim() || undefined,
      })
      .subscribe({
        next: (creado) => {
          this.prestamos.update((lista) => [creado, ...lista]);
          this.nuevoPrestamoNombre = '';
          this.nuevoPrestamoNotas = '';
          this.gestionandoPrestamo.set(false);
          this.refrescarPrestamoActivo();
          this.notificacion.exito('Préstamo registrado', `Le prestaste "${ui.titulo}" a ${creado.nombrePersona}.`);
        },
        error: (err) => {
          this.gestionandoPrestamo.set(false);
          this.notificacion.error('Error', err.error?.detail ?? 'No se pudo registrar el préstamo.');
        },
      });
  }

  devolver(prestamo: RespuestaPrestamoDto) {
    if (!prestamo.estaActivo) return;

    this.gestionandoPrestamo.set(true);
    this.bibliotecaService.registrarDevolucion(prestamo.id).subscribe({
      next: () => {
        this.prestamos.update((lista) =>
          lista.map((p) =>
            p.id === prestamo.id ? { ...p, estaActivo: false, fechaDevolucion: new Date().toISOString() } : p,
          ),
        );
        this.gestionandoPrestamo.set(false);
        this.refrescarPrestamoActivo();
        this.notificacion.exito('Devolución registrada', `"${this.userItem()?.titulo ?? 'El título'}" volvió contigo.`);
      },
      error: () => {
        this.gestionandoPrestamo.set(false);
        this.notificacion.error('Error', 'No se pudo registrar la devolución.');
      },
    });
  }

  quitarPrestamo(prestamo: RespuestaPrestamoDto) {
    this.confirmation.confirm({
      header: 'Eliminar préstamo',
      message: `¿Borrar el registro del préstamo a "${prestamo.nombrePersona}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { label: 'Sí, borrar', severity: 'danger' },
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary' },
      accept: () => {
        this.bibliotecaService.eliminarPrestamo(prestamo.id).subscribe({
          next: () => {
            this.prestamos.update((lista) => lista.filter((p) => p.id !== prestamo.id));
            this.refrescarPrestamoActivo();
            this.notificacion.exito('Registro eliminado', '');
          },
          error: () => {
            this.notificacion.error('Error', 'No se pudo eliminar el registro.');
          },
        });
      },
    });
  }

  iniciarEdicionResena() {
    const ui = this.userItem();
    if (!ui) return;
    this.resenaTemporal = ui.review ?? '';
    this.editandoResena.set(true);
  }

  cancelarResena() {
    this.editandoResena.set(false);
    this.resenaTemporal = '';
  }

  guardarResena() {
    const ui = this.userItem();
    if (!ui) return;

    // String vacío borra la reseña (el backend ignora null = "no tocar")
    const review = this.resenaTemporal.trim();
    const dto: PeticionActualizarUserItemDto = { review };
    this.guardandoResena.set(true);
    this.bibliotecaService.actualizarItemDeBiblioteca(ui.id, dto).subscribe({
      next: () => {
        this.userItem.update((v) => (v ? { ...v, review } : v));
        this.editandoResena.set(false);
        this.resenaTemporal = '';
        this.guardandoResena.set(false);
        this.notificacion.exito(review ? 'Reseña guardada' : 'Reseña eliminada', '');
      },
      error: () => {
        this.guardandoResena.set(false);
        this.notificacion.error('Error', 'No se pudo guardar tu reseña.');
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
            this.formatosPropios = [];
            this.plataformasPropias = [];
            this.prestamos.set([]);
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

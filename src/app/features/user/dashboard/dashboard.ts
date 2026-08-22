import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

import { BibliotecaService } from '@core/services/biblioteca/biblioteca.service';
import { ItemService } from '@core/services/items/item.service';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import {
  CONSUMPTION_STATUS_LABELS,
  ConsumptionStatus,
  PeticionActualizarUserItemDto,
  PeticionAgregarABibliotecaDto,
  RespuestaUserItemDto,
} from '@core/models/biblioteca.model';
import { ItemDto } from '@core/models/item.model';

interface StatusOption {
  value: ConsumptionStatus;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    TooltipModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private bibliotecaService: BibliotecaService = inject(BibliotecaService);
  private itemService: ItemService = inject(ItemService);
  private notificacion: NotificacionService = inject(NotificacionService);

  readonly statusOptions: StatusOption[] = [
    { value: ConsumptionStatus.Pendiente, label: 'Pendiente' },
    { value: ConsumptionStatus.EnProgreso, label: 'En progreso' },
    { value: ConsumptionStatus.Completado, label: 'Completado' },
    { value: ConsumptionStatus.Abandonado, label: 'Abandonado' },
  ];

  items: WritableSignal<RespuestaUserItemDto[]> = signal<RespuestaUserItemDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  totalRecords: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(1);
  rows: WritableSignal<number> = signal(10);

  terminoBusqueda: WritableSignal<string> = signal('');
  filtroStatus: WritableSignal<ConsumptionStatus | undefined> = signal(undefined);
  soloFavoritos: WritableSignal<boolean> = signal(false);

  catalogoDisponible: WritableSignal<ItemDto[]> = signal<ItemDto[]>([]);
  modalAbierto: WritableSignal<boolean> = signal(false);
  editando: WritableSignal<RespuestaUserItemDto | null> = signal(null);

  itemSeleccionadoId: string = '';
  nuevoStatus: ConsumptionStatus = ConsumptionStatus.Pendiente;
  nuevoPersonalRating?: number;
  nuevoReview: string = '';
  nuevoIsPrivate: boolean = false;

  guardando: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.cargarBiblioteca();
    this.cargarCatalogoDisponible();
  }

  getStatusLabel(status: ConsumptionStatus): string {
    return CONSUMPTION_STATUS_LABELS[status] ?? 'Desconocido';
  }

  getStatusBadgeClass(status: ConsumptionStatus): string {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border';
    switch (status) {
      case ConsumptionStatus.Pendiente:
        return `${base} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50`;
      case ConsumptionStatus.EnProgreso:
        return `${base} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50`;
      case ConsumptionStatus.Completado:
        return `${base} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50`;
      case ConsumptionStatus.Abandonado:
        return `${base} bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50`;
      default:
        return `${base} bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`;
    }
  }

  cargarBiblioteca() {
    this.isLoading.set(true);
    this.bibliotecaService
      .obtenerBiblioteca(
        {
          terminoBusqueda: this.terminoBusqueda() || undefined,
          status: this.filtroStatus(),
          isFavorite: this.soloFavoritos() ? true : undefined,
        },
        this.currentPage(),
        this.rows(),
      )
      .subscribe({
        next: (respuesta) => {
          this.items.set(respuesta.registros);
          this.totalRecords.set(respuesta.metadata.totalRegistros);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar la biblioteca:', err);
          this.notificacion.error('Error al cargar', 'No se pudo recuperar tu biblioteca.');
          this.items.set([]);
          this.isLoading.set(false);
        },
      });
  }

  buscar() {
    this.currentPage.set(1);
    this.cargarBiblioteca();
  }

  limpiarFiltros() {
    this.terminoBusqueda.set('');
    this.filtroStatus.set(undefined);
    this.soloFavoritos.set(false);
    this.currentPage.set(1);
    this.cargarBiblioteca();
  }

  onPageChange(event: TableLazyLoadEvent) {
    const rows = event.rows ?? 10;
    const first = event.first ?? 0;
    this.rows.set(rows);
    this.currentPage.set(Math.floor(first / rows) + 1);
    this.cargarBiblioteca();
  }

  cargarCatalogoDisponible() {
    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };
    this.itemService.obtenerItems(filtroVacio, 1, 60).subscribe({
      next: (respuesta) => this.catalogoDisponible.set(respuesta.registros),
      error: () => {
        /* silencioso: solo afecta al selector del modal */
      },
    });
  }

  abrirModal() {
    this.editando.set(null);
    this.itemSeleccionadoId = '';
    this.nuevoStatus = ConsumptionStatus.Pendiente;
    this.nuevoPersonalRating = undefined;
    this.nuevoReview = '';
    this.nuevoIsPrivate = false;
    this.modalAbierto.set(true);
  }

  abrirEdicion(item: RespuestaUserItemDto) {
    this.editando.set(item);
    this.itemSeleccionadoId = item.itemId;
    this.nuevoStatus = item.status;
    this.nuevoPersonalRating = item.personalRating ?? undefined;
    this.nuevoReview = item.review ?? '';
    this.nuevoIsPrivate = item.isPrivate;
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.editando.set(null);
  }

  guardar() {
    if (this.editando()) {
      this.guardarEdicion();
      return;
    }

    if (!this.itemSeleccionadoId) {
      this.notificacion.info('Atención', 'Selecciona un ítem del catálogo.');
      return;
    }

    const dto: PeticionAgregarABibliotecaDto = {
      itemId: this.itemSeleccionadoId,
      status: this.nuevoStatus,
      isFavorite: false,
      isPrivate: this.nuevoIsPrivate,
      personalRating: this.nuevoPersonalRating,
      review: this.nuevoReview || undefined,
    };

    this.guardando.set(true);
    this.bibliotecaService.agregarABiblioteca(dto).subscribe({
      next: () => {
        this.notificacion.exito('Agregado', 'El ítem se añadió a tu biblioteca.');
        this.cerrarModal();
        this.guardando.set(false);
        this.cargarBiblioteca();
      },
      error: (err) => {
        console.error('Error al agregar:', err);
        this.notificacion.error('Error', err.error?.detail ?? 'No se pudo agregar el ítem.');
        this.guardando.set(false);
      },
    });
  }

  private guardarEdicion() {
    const item = this.editando();
    if (!item) return;

    const dto: PeticionActualizarUserItemDto = {
      status: this.nuevoStatus,
      personalRating: this.nuevoPersonalRating,
      review: this.nuevoReview || undefined,
      isPrivate: this.nuevoIsPrivate,
    };

    this.guardando.set(true);
    this.bibliotecaService.actualizarItemDeBiblioteca(item.id, dto).subscribe({
      next: () => {
        this.notificacion.exito('Actualizado', `Se actualizó "${item.titulo}".`);
        this.cerrarModal();
        this.guardando.set(false);
        this.cargarBiblioteca();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.notificacion.error('Error', err.error?.detail ?? 'No se pudo actualizar el ítem.');
        this.guardando.set(false);
      },
    });
  }

  toggleFavorito(item: RespuestaUserItemDto) {
    const nuevo = !item.isFavorite;
    this.bibliotecaService.marcarFavorito(item.id, nuevo).subscribe({
      next: () => {
        this.items.update((lista) =>
          lista.map((it) => (it.id === item.id ? { ...it, isFavorite: nuevo } : it)),
        );
      },
      error: (err) => {
        console.error('Error al marcar favorito:', err);
        this.notificacion.error('Error', 'No se pudo actualizar el favorito.');
      },
    });
  }

  eliminar(item: RespuestaUserItemDto) {
    this.bibliotecaService.eliminarDeBiblioteca(item.id).subscribe({
      next: () => {
        this.items.update((lista) => lista.filter((it) => it.id !== item.id));
        this.totalRecords.update((t) => Math.max(0, t - 1));
        this.notificacion.exito('Eliminado', `"${item.titulo}" se quitó de tu biblioteca.`);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.notificacion.error('Error', err.error?.detail ?? 'No se pudo eliminar el ítem.');
      },
    });
  }
}
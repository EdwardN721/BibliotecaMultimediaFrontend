import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ItemService } from '@core/services/items/item.service';
import { BibliotecaService } from '@core/services/biblioteca/biblioteca.service';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { ItemDto } from '@core/models/item.model';
import { TipoMedioDto } from '@core/models/tipo.medios.model';
import { GeneroDto } from '@core/models/generos.model';
import { PlataformaDto } from '@core/models/plataformas.model';
import {
  ConsumptionStatus,
  PeticionAgregarABibliotecaDto,
  RespuestaUserItemDto,
} from '@core/models/biblioteca.model';
import { PosterCard, PosterCardItem } from '@shared/components/user/poster-card/poster-card';
import { SkeletonCard } from '@shared/components/user/skeleton-card/skeleton-card';
import { mapearItemCatalogo } from '@core/utils/poster-card-mappers';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, FormsModule, PosterCard, SkeletonCard],
  templateUrl: './explorar.html',
  styleUrl: './explorar.css',
})
export class Explorar implements OnInit, OnDestroy {
  private itemService: ItemService = inject(ItemService);
  private bibliotecaService: BibliotecaService = inject(BibliotecaService);
  private notificacion: NotificacionService = inject(NotificacionService);
  private tipoMediosService: TipoMediosService = inject(TipoMediosService);
  private generosService: GenerosService = inject(GenerosService);
  private plataformasService: PlataformasService = inject(PlataformasService);

  // Última petición de búsqueda en curso: se cancela antes de lanzar una nueva
  // para evitar respuestas fuera de orden / race conditions en filtros o paginación.
  private busquedaSubscription: Subscription | null = null;

  tarjetas: WritableSignal<PosterCardItem[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  agregandoIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  tiposMedio: WritableSignal<TipoMedioDto[]> = signal([]);
  generos: WritableSignal<GeneroDto[]> = signal([]);
  plataformas: WritableSignal<PlataformaDto[]> = signal([]);

  terminoBusqueda: string = '';
  tipoSeleccionado: string = '';
  generoSeleccionado: string = '';
  plataformaSeleccionada: string = '';

  paginaActual: number = 1;
  readonly pageSize = 24;
  hayMasPaginas: WritableSignal<boolean> = signal(false);
  biblioteca: WritableSignal<RespuestaUserItemDto[]> = signal([]);

  ngOnInit() {
    this.cargarFiltros();
    this.buscar(true);
    this.cargarBiblioteca();
  }

  cargarFiltros() {
    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: false };

    this.tipoMediosService.obtenerTipoMedios(filtroVacio, 1, 50).subscribe({
      next: (r) => this.tiposMedio.set(r.registros),
      error: () => {},
    });
    this.generosService.obtenerGeneros(filtroVacio, 1, 100).subscribe({
      next: (r) => this.generos.set(r.registros),
      error: () => {},
    });
    this.plataformasService.obtenerPlataformas(filtroVacio, 1, 100).subscribe({
      next: (r) => this.plataformas.set(r.registros),
      error: () => {},
    });
  }

  cargarBiblioteca() {
    this.bibliotecaService.obtenerBiblioteca({}, 1, 200).subscribe({
      next: (respuesta) => {
        this.biblioteca.set(respuesta.registros);
        this.marcarEnBiblioteca();
      },
      error: () => {},
    });
  }

  marcarEnBiblioteca() {
    const registros = this.biblioteca();
    const ids = new Set(registros.map((b) => b.itemId));
    const favoritos = new Map(registros.map((b) => [b.itemId, b]));
    this.tarjetas.update((lista) =>
      lista.map((t) => ({
        ...t,
        enBiblioteca: ids.has(t.id),
        userItemId: favoritos.get(t.id)?.id,
        isFavorite: favoritos.get(t.id)?.isFavorite,
      })),
    );
  }

  buscar(resetear: boolean) {
    if (resetear) {
      this.paginaActual = 1;
      this.isLoading.set(true);
    }

    this.busquedaSubscription?.unsubscribe();

    const filtro = {
      terminoBusqueda: this.terminoBusqueda.trim(),
      ordenadoPor: '',
      ordenDescendente: true,
      mediaTypeId: this.tipoSeleccionado || undefined,
      genreId: this.generoSeleccionado || undefined,
      platformId: this.plataformaSeleccionada || undefined,
    };

    this.busquedaSubscription = this.itemService.obtenerItems(filtro, this.paginaActual, this.pageSize).subscribe({
      next: (respuesta) => {
        const nuevas = respuesta.registros.map((item) => this.mapear(item));
        this.tarjetas.update((actuales) =>
          resetear ? nuevas : [...actuales, ...nuevas],
        );
        this.hayMasPaginas.set(respuesta.metadata.hasNextPage);
        this.isLoading.set(false);
        this.marcarEnBiblioteca();
      },
      error: () => {
        this.notificacion.error('Error al cargar', 'No se pudo recuperar el catálogo.');
        this.tarjetas.set([]);
        this.isLoading.set(false);
      },
    });
  }

  ngOnDestroy() {
    this.busquedaSubscription?.unsubscribe();
  }

  mapear(item: ItemDto): PosterCardItem {
    return mapearItemCatalogo(item);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.tipoSeleccionado = '';
    this.generoSeleccionado = '';
    this.plataformaSeleccionada = '';
    this.buscar(true);
  }

  hayFiltrosActivos(): boolean {
    return !!(
      this.terminoBusqueda.trim() ||
      this.tipoSeleccionado ||
      this.generoSeleccionado ||
      this.plataformaSeleccionada
    );
  }

  agregarDesdeTarjeta(tarjeta: PosterCardItem) {
    const dto: PeticionAgregarABibliotecaDto = {
      itemId: tarjeta.id,
      status: ConsumptionStatus.Pendiente,
      isFavorite: false,
      isPrivate: false,
    };

    this.agregandoIds.update((set) => new Set(set).add(tarjeta.id));

    this.bibliotecaService.agregarABiblioteca(dto).subscribe({
      next: (creado) => {
        this.agregandoIds.update((set) => {
          const nuevo = new Set(set);
          nuevo.delete(tarjeta.id);
          return nuevo;
        });
        this.biblioteca.update((lista) => [...lista, creado]);
        this.marcarEnBiblioteca();
        this.notificacion.exito('Agregado', `"${tarjeta.titulo}" se añadió a tu biblioteca.`);
      },
      error: (err) => {
        this.agregandoIds.update((set) => {
          const nuevo = new Set(set);
          nuevo.delete(tarjeta.id);
          return nuevo;
        });
        this.notificacion.error(
          'No se pudo agregar',
          err.error?.detail ?? 'Verifica tu conexión o si el título ya está en tu biblioteca.',
        );
      },
    });
  }

  toggleFavoritoDesdeTarjeta(tarjeta: PosterCardItem) {
    if (!tarjeta.userItemId) return;

    const nuevo = !tarjeta.isFavorite;
    this.bibliotecaService.marcarFavorito(tarjeta.userItemId, nuevo).subscribe({
      next: () => {
        this.biblioteca.update((lista) =>
          lista.map((b) => (b.itemId === tarjeta.id ? { ...b, isFavorite: nuevo } : b)),
        );
        this.marcarEnBiblioteca();
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo actualizar el favorito.');
      },
    });
  }
}

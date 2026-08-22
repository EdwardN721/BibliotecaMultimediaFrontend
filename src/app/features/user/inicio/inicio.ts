import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth/auth';
import { ItemService } from '@core/services/items/item.service';
import { BibliotecaService } from '@core/services/biblioteca/biblioteca.service';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { ItemDto } from '@core/models/item.model';
import {
  ConsumptionStatus,
  PeticionAgregarABibliotecaDto,
  RespuestaUserItemDto,
} from '@core/models/biblioteca.model';
import { BibliotecaStats } from '@core/models/biblioteca-stats.model';
import { PosterCardItem } from '@shared/components/user/poster-card/poster-card';
import { ContentRow } from '@shared/components/user/content-row/content-row';

interface FilaCatalogo {
  titulo: string;
  items: PosterCardItem[];
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, ContentRow],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private itemService: ItemService = inject(ItemService);
  private bibliotecaService: BibliotecaService = inject(BibliotecaService);
  private notificacion: NotificacionService = inject(NotificacionService);
  private authService: AuthService = inject(AuthService);

  destacados: WritableSignal<ItemDto[]> = signal([]);
  biblioteca: WritableSignal<RespuestaUserItemDto[]> = signal([]);
  stats: WritableSignal<BibliotecaStats | null> = signal(null);
  catalogo: WritableSignal<ItemDto[]> = signal([]);

  cargandoDestacados: WritableSignal<boolean> = signal(true);
  cargandoBiblioteca: WritableSignal<boolean> = signal(true);
  agregandoId: WritableSignal<string | null> = signal(null);

  readonly enBibliotecaIds = computed(() => new Set(this.biblioteca().map((b) => b.itemId)));

  readonly hero = computed(() => {
    const conImagen = this.destacados().find((d) => d.mainImageUrl) ?? this.destacados()[0];
    return conImagen ?? null;
  });

  readonly saludo = computed(() => {
    const nombre = this.authService.nombreUsuario();
    return nombre ? `Hola, ${nombre}` : 'Bienvenido de nuevo';
  });

  readonly filaContinuar = computed(() =>
    this.mapearBiblioteca(this.biblioteca().filter((b) => b.status === ConsumptionStatus.EnProgreso)),
  );
  readonly filaPendientes = computed(() =>
    this.mapearBiblioteca(this.biblioteca().filter((b) => b.status === ConsumptionStatus.Pendiente)),
  );
  readonly filaNovedades = computed(() => this.mapearCatalogo(this.destacados()));

  readonly filasCatalogo = computed<FilaCatalogo[]>(() => {
    const grupos = new Map<string, ItemDto[]>();
    for (const item of this.catalogo()) {
      const tipo = item.mediaType || 'Otros';
      if (!grupos.has(tipo)) grupos.set(tipo, []);
      grupos.get(tipo)!.push(item);
    }

    return [...grupos.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 4)
      .map(([tipo, items]) => ({
        titulo: tipo + 's',
        items: this.mapearCatalogo(items).slice(0, 20),
      }));
  });

  ngOnInit() {
    this.cargarDestacados();
    this.cargarBiblioteca();
    this.cargarStats();
    this.cargarCatalogo();
  }

  cargarDestacados() {
    this.cargandoDestacados.set(true);
    this.itemService.obtenerDestacados(12).subscribe({
      next: (items) => {
        this.destacados.set(items ?? []);
        this.cargandoDestacados.set(false);
      },
      error: () => {
        this.cargandoDestacados.set(false);
      },
    });
  }

  cargarBiblioteca() {
    this.cargandoBiblioteca.set(true);
    this.bibliotecaService.obtenerBiblioteca({}, 1, 200).subscribe({
      next: (respuesta) => {
        this.biblioteca.set(respuesta.registros);
        this.cargandoBiblioteca.set(false);
      },
      error: () => {
        this.cargandoBiblioteca.set(false);
      },
    });
  }

  cargarStats() {
    this.bibliotecaService.obtenerStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.stats.set(null),
    });
  }

  cargarCatalogo() {
    const filtro = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };
    this.itemService.obtenerItems(filtro, 1, 100).subscribe({
      next: (respuesta) => this.catalogo.set(respuesta.registros),
      error: () => this.catalogo.set([]),
    });
  }

  mapearBiblioteca(items: RespuestaUserItemDto[]): PosterCardItem[] {
    return items.map((b) => ({
      id: b.itemId,
      userItemId: b.id,
      titulo: b.titulo,
      imageUrl: b.imageUrl,
      subtitulo: [b.mediaType, b.format].filter(Boolean).join(' • '),
      descripcion: undefined,
      personalRating: b.personalRating ?? undefined,
      status: b.status,
      isFavorite: b.isFavorite,
      enBiblioteca: true,
    }));
  }

  mapearCatalogo(items: ItemDto[]): PosterCardItem[] {
    const idsEnBiblioteca = this.enBibliotecaIds();
    return items.map((item) => ({
      id: item.id,
      titulo: item.title,
      imageUrl: item.mainImageUrl,
      subtitulo: [item.mediaType, item.format, item.releaseDate ? new Date(item.releaseDate).getFullYear() : null]
        .filter(Boolean)
        .join(' • '),
      descripcion: item.descripcion,
      ratingCatalogo: item.rating ?? undefined,
      enBiblioteca: idsEnBiblioteca.has(item.id),
    }));
  }

  agregarAlHero() {
    const hero = this.hero();
    if (!hero) return;
    this.agregarABiblioteca(hero.id);
  }

  estaAgregando(id: string): boolean {
    return this.agregandoId() === id;
  }

  agregarDesdeFila(item: PosterCardItem) {
    if (item.userItemId) return;
    this.agregarABiblioteca(item.id);
  }

  toggleFavoritoDesdeFila(item: PosterCardItem) {
    if (!item.userItemId) return;

    const nuevo = !item.isFavorite;
    this.bibliotecaService.marcarFavorito(item.userItemId, nuevo).subscribe({
      next: () => {
        this.biblioteca.update((lista) =>
          lista.map((b) => (b.itemId === item.id ? { ...b, isFavorite: nuevo } : b)),
        );
        this.notificacion.exito(
          nuevo ? 'Agregado a favoritos' : 'Quitado de favoritos',
          `"${item.titulo}" se actualizó correctamente.`,
        );
      },
      error: () => {
        this.notificacion.error('Error', 'No se pudo actualizar el favorito.');
      },
    });
  }

  private agregarABiblioteca(itemId: string) {
    const dto: PeticionAgregarABibliotecaDto = {
      itemId,
      status: ConsumptionStatus.Pendiente,
      isFavorite: false,
      isPrivate: false,
    };

    this.agregandoId.set(itemId);
    this.bibliotecaService.agregarABiblioteca(dto).subscribe({
      next: (creado) => {
        this.biblioteca.update((lista) => [...lista, creado]);
        this.agregandoId.set(null);
        this.cargarStats();
        this.notificacion.exito('Agregado', 'El título se añadió a tu biblioteca como pendiente.');
      },
      error: (err) => {
        this.agregandoId.set(null);
        this.notificacion.error(
          'No se pudo agregar',
          err.error?.detail ?? 'Verifica tu conexión o si el título ya está en tu biblioteca.',
        );
      },
    });
  }
}

import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ItemService } from '@core/services/items/item.service';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { ItemDto } from '@core/models/item.model';

interface StatTarjeta {
  etiqueta: string;
  valor: number;
  icono: string;
  color: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private itemService: ItemService = inject(ItemService);
  private generosService: GenerosService = inject(GenerosService);
  private creadoresService: CreadoresService = inject(CreadoresService);
  private tipoMediosService: TipoMediosService = inject(TipoMediosService);

  totalItems: WritableSignal<number> = signal(0);
  totalGeneros: WritableSignal<number> = signal(0);
  totalCreadores: WritableSignal<number> = signal(0);
  totalTiposMedio: WritableSignal<number> = signal(0);

  ultimosAgregados: WritableSignal<ItemDto[]> = signal([]);
  distribucionTipos: WritableSignal<{ nombre: string; cantidad: number; porcentaje: number }[]> =
    signal([]);

  cargando: WritableSignal<boolean> = signal(true);

  readonly tarjetas = computed<StatTarjeta[]>(() => this.construirTarjetas());

  ngOnInit() {
    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };

    this.itemService.obtenerItems(filtroVacio, 1, 1).subscribe({
      next: (r) => {
        this.totalItems.set(r.metadata.totalRegistros);
        this.verificarCarga();
      },
      error: () => this.verificarCarga(),
    });

    this.generosService.obtenerGeneros({ ...filtroVacio }, 1, 1).subscribe({
      next: (r) => {
        this.totalGeneros.set(r.metadata.totalRegistros);
        this.verificarCarga();
      },
      error: () => this.verificarCarga(),
    });

    this.creadoresService.obtenerCreadores({ ...filtroVacio }, 1, 1).subscribe({
      next: (r) => {
        this.totalCreadores.set(r.metadata.totalRegistros);
        this.verificarCarga();
      },
      error: () => this.verificarCarga(),
    });

    this.tipoMediosService.obtenerTipoMedios({ ...filtroVacio }, 1, 1).subscribe({
      next: (r) => {
        this.totalTiposMedio.set(r.metadata.totalRegistros);
        this.verificarCarga();
      },
      error: () => this.verificarCarga(),
    });

    this.itemService.obtenerDestacados(8).subscribe({
      next: (items) => this.ultimosAgregados.set(items ?? []),
      error: () => this.ultimosAgregados.set([]),
    });

    // La agregación se hace en la base de datos (GROUP BY): ya no traemos
    // cientos de ítems para calcular la distribución en el cliente
    this.itemService.obtenerDistribucionPorTipoMedio().subscribe({
      next: (distribucion) => {
        this.distribucionTipos.set(
          distribucion.map((d) => ({
            nombre: d.nombre,
            cantidad: d.cantidad,
            porcentaje: Math.round(d.porcentaje),
          })),
        );
      },
      error: () => this.distribucionTipos.set([]),
    });
  }

  private pendientes = 4;

  private verificarCarga() {
    this.pendientes--;
    if (this.pendientes <= 0) {
      this.cargando.set(false);
    }
  }

  private construirTarjetas(): StatTarjeta[] {
    return [
      {
        etiqueta: 'Ítems en catálogo',
        valor: this.totalItems(),
        icono: 'pi-database',
        color: 'from-cyan-500 to-blue-600 shadow-cyan-500/20',
        link: '/admin/items',
      },
      {
        etiqueta: 'Géneros',
        valor: this.totalGeneros(),
        icono: 'pi-tags',
        color: 'from-fuchsia-500 to-purple-600 shadow-fuchsia-500/20',
        link: '/admin/catalogos/generos',
      },
      {
        etiqueta: 'Creadores',
        valor: this.totalCreadores(),
        icono: 'pi-users',
        color: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
        link: '/admin/catalogos/creadores',
      },
      {
        etiqueta: 'Tipos de medio',
        valor: this.totalTiposMedio(),
        icono: 'pi-box',
        color: 'from-amber-500 to-orange-600 shadow-amber-500/20',
        link: '/admin/catalogos/tipo-medios',
      },
    ];
  }
}

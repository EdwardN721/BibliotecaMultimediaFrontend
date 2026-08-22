import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ItemService } from '@core/services/items/item.service';
import { BibliotecaService } from '@core/services/biblioteca/biblioteca.service';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { ItemDto } from '@core/models/item.model';
import { ConsumptionStatus, PeticionAgregarABibliotecaDto } from '@core/models/biblioteca.model';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TooltipModule],
  templateUrl: './explorar.html',
  styleUrl: './explorar.css',
})
export class Explorar implements OnInit {
  private itemService: ItemService = inject(ItemService);
  private bibliotecaService: BibliotecaService = inject(BibliotecaService);
  private notificacion: NotificacionService = inject(NotificacionService);

  items: WritableSignal<ItemDto[]> = signal<ItemDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  agregandoIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.isLoading.set(true);
    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };

    this.itemService.obtenerItems(filtroVacio, 1, 60).subscribe({
      next: (respuesta) => {
        this.items.set(respuesta.registros);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.notificacion.error('Error al cargar', 'No se pudo recuperar el catálogo.');
        this.items.set([]);
        this.isLoading.set(false);
      },
    });
  }

  agregarABiblioteca(item: ItemDto) {
    const dto: PeticionAgregarABibliotecaDto = {
      itemId: item.id,
      status: ConsumptionStatus.Pendiente,
      isFavorite: false,
      isPrivate: false,
    };

    this.agregandoIds.update((set) => {
      const nuevo = new Set(set);
      nuevo.add(item.id);
      return nuevo;
    });

    this.bibliotecaService.agregarABiblioteca(dto).subscribe({
      next: () => {
        this.agregandoIds.update((set) => {
          const nuevo = new Set(set);
          nuevo.delete(item.id);
          return nuevo;
        });
        this.notificacion.exito('Agregado', `"${item.title}" se añadió a tu biblioteca.`);
      },
      error: (err) => {
        this.agregandoIds.update((set) => {
          const nuevo = new Set(set);
          nuevo.delete(item.id);
          return nuevo;
        });
        this.notificacion.error(
          'No se pudo agregar',
          err.error?.detail ?? 'Verifica tu conexión o si el ítem ya está en tu biblioteca.',
        );
      },
    });
  }

  estaAgregando(id: string): boolean {
    return this.agregandoIds().has(id);
  }
}
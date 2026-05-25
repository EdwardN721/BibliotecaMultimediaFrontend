import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ItemService } from '../../../core/services/items/item.service';
import { ItemDto } from '../../../core/models/item.model';

@Component({
  selector: 'app-items.component',
  imports: [],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit{
  private itemService: ItemService = inject(ItemService);

  items: WritableSignal<ItemDto[]> = signal<ItemDto[]>([]);
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo(){
    this.isLoading.set(true);
    this.itemService.obtenerItems("", "", true, 1, 10).subscribe({
      next: (response) => {
        console.log(response);
        this.items.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.errorMessage.set('No se pudo recuperar el catálogo de ítems.');
        this.isLoading.set(false);
      }
    })
  }
}

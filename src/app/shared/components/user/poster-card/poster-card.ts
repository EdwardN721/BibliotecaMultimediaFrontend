import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CONSUMPTION_STATUS_LABELS, ConsumptionStatus } from '@core/models/biblioteca.model';

export interface PosterCardItem {
  id: string;
  userItemId?: string;
  titulo: string;
  imageUrl?: string;
  subtitulo?: string;
  descripcion?: string;
  ratingCatalogo?: number;
  personalRating?: number;
  status?: ConsumptionStatus;
  isFavorite?: boolean;
  enBiblioteca?: boolean;
}

@Component({
  selector: 'app-poster-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poster-card.html',
  styleUrl: './poster-card.css',
})
export class PosterCard {
  item = input.required<PosterCardItem>();
  mostrarAgregar = input(false);

  abrir = output<PosterCardItem>();
  agregar = output<PosterCardItem>();
  toggleFavorito = output<PosterCardItem>();

  get statusLabel(): string {
    const status = this.item().status;
    return status ? CONSUMPTION_STATUS_LABELS[status] ?? '' : '';
  }

  get statusBadgeClass(): string {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide';
    switch (this.item().status) {
      case ConsumptionStatus.EnProgreso:
        return `${base} bg-blue-600/90 text-white`;
      case ConsumptionStatus.Completado:
        return `${base} bg-emerald-600/90 text-white`;
      case ConsumptionStatus.Abandonado:
        return `${base} bg-red-600/90 text-white`;
      case ConsumptionStatus.Deseado:
        return `${base} bg-violet-600/90 text-white`;
      default:
        return `${base} bg-amber-500/90 text-black`;
    }
  }

  onAgregar(event: Event) {
    event.stopPropagation();
    this.agregar.emit(this.item());
  }

  onFavorito(event: Event) {
    event.stopPropagation();
    this.toggleFavorito.emit(this.item());
  }
}

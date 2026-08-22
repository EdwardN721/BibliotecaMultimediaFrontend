import { Component, ElementRef, input, output, signal, viewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PosterCard, PosterCardItem } from '../poster-card/poster-card';
import { SkeletonCard } from '../skeleton-card/skeleton-card';

@Component({
  selector: 'app-content-row',
  standalone: true,
  imports: [CommonModule, RouterLink, PosterCard, SkeletonCard],
  templateUrl: './content-row.html',
  styleUrl: './content-row.css',
})
export class ContentRow {
  titulo = input.required<string>();
  items = input.required<PosterCardItem[]>();
  cargando = input(false);
  mostrarAgregar = input(false);
  verTodoLink = input<string | null>(null);

  abrir = output<PosterCardItem>();
  agregar = output<PosterCardItem>();
  toggleFavorito = output<PosterCardItem>();

  private readonly desplazamiento = 0.85;
  puedeIzquierda: WritableSignal<boolean> = signal(false);
  puedeDerecha: WritableSignal<boolean> = signal(true);

  contenedor = viewChild<ElementRef<HTMLDivElement>>('contenedor');

  scroll(direccion: number) {
    const el = this.contenedor()?.nativeElement;
    if (!el) return;

    el.scrollBy({ left: direccion * el.clientWidth * this.desplazamiento, behavior: 'smooth' });
    setTimeout(() => this.actualizarFlechas(), 400);
  }

  onScrollContenedor() {
    this.actualizarFlechas();
  }

  actualizarFlechas() {
    const el = this.contenedor()?.nativeElement;
    if (!el) return;

    this.puedeIzquierda.set(el.scrollLeft > 10);
    this.puedeDerecha.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }
}

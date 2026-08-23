import { Directive, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { extraerNombre } from './nuevo-catalogo.base';

/**
 * Lógica común de los formularios de edición de catálogos:
 * carga la entidad por id de ruta, rellena el formulario y guarda cambios.
 *
 * Los controles del formulario deben llamarse igual que las propiedades
 * de la entidad para que `patchValue` los mapee automáticamente.
 */
@Directive()
export abstract class EditarCatalogoBase implements OnInit {
  private router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected notificacion = inject(NotificacionService);

  /** Nombre legible de la entidad para los mensajes ("formato", "género"...). */
  protected abstract nombreEntidad: string;
  protected abstract rutaListado: string;
  protected abstract formulario: FormGroup;
  protected abstract obtenerDesdeServicio(id: string): Observable<unknown>;
  protected abstract actualizarEnServicio(
    id: string,
    payload: Record<string, unknown>,
  ): Observable<unknown>;

  isSubmitting: WritableSignal<boolean> = signal(false);
  isLoadingData: WritableSignal<boolean> = signal(true);
  entidadId: string = '';

  ngOnInit(): void {
    this.entidadId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.entidadId) {
      this.volverAlListado();
      return;
    }

    this.obtenerDesdeServicio(this.entidadId).subscribe({
      next: (entidad) => {
        this.formulario.patchValue(entidad as object);
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el registro:', err);
        this.notificacion.error(
          'Error al cargar',
          'Ocurrió un error de comunicación con el servidor.',
        );
        this.volverAlListado();
      },
    });
  }

  actualizar(): void {
    if (this.formulario.invalid) return;

    this.isSubmitting.set(true);
    const payload = this.formulario.getRawValue() as Record<string, unknown>;

    this.actualizarEnServicio(this.entidadId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.exito(
          'Cambios guardados',
          `La información de "${extraerNombre(payload)}" ha sido actualizada.`,
        );
        this.volverAlListado();
      },
      error: (err) => {
        console.error('Error al actualizar el registro:', err);
        this.notificacion.error('Error al actualizar', 'Los cambios no se pudieron guardar.');
        this.isSubmitting.set(false);
      },
    });
  }

  protected volverAlListado(): void {
    this.router.navigate([this.rutaListado]);
  }
}

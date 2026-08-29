import { Directive, WritableSignal, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { LoggerService } from '@core/services/logger/logger.service';

/**
 * Lógica común de los formularios de creación de catálogos.
 * El componente concreto define los campos del formulario y su servicio.
 */
@Directive()
export abstract class NuevoCatalogoBase {
  protected router = inject(Router);
  protected notificacion = inject(NotificacionService);
  protected logger = inject(LoggerService);

  /** Nombre legible de la entidad para los mensajes ("formato", "género"...). */
  protected abstract nombreEntidad: string;
  protected abstract rutaListado: string;
  protected abstract formulario: FormGroup;
  protected abstract crearEnServicio(payload: Record<string, unknown>): Observable<unknown>;

  isSubmitting: WritableSignal<boolean> = signal(false);

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.formulario.getRawValue() as Record<string, unknown>;

    this.crearEnServicio(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.exito(
          'Registro exitoso',
          `El ${this.nombreEntidad} "${extraerNombre(payload)}" se agregó al catálogo.`,
        );
        this.router.navigate([this.rutaListado]);
      },
      error: (err) => {
        this.logger.error('nuevo-catalogo', 'Error al registrar:', err);
        this.notificacion.error(
          'Error al registrar',
          'Ocurrió un error de comunicación con el servidor.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}

export function extraerNombre(valores: Record<string, unknown>): string {
  const nombre = valores['nombre'] ?? valores['name'];
  return typeof nombre === 'string' ? nombre : '';
}

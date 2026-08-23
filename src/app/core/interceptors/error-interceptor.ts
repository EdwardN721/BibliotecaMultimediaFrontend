import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiError, ApiErrorCategory, ProblemDetails } from '@core/models/api-error.model';
import { AuthService } from '@core/services/auth/auth';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

/**
 * Interceptor global de errores:
 * - 401 fuera del flujo de login: cierra sesión y redirige a /login
 * - Errores de red/servidor caído: toast global informativo
 * - El resto de errores se relanza como ApiError manteniendo compatibilidad
 *   con los manejadores locales (`err.error?.detail`) para que cada pantalla
 *   siga mostrando su mensaje de negocio sin duplicar toasts.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificacion = inject(NotificacionService);

  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        const apiError = clasificar(err, req.url);
        const esFlujoAuth = req.url.includes('/api/v1/Auth/');

        if (apiError.category === ApiErrorCategory.Unauthorized && !esFlujoAuth && authService.isAuthenticated()) {
          // Token inválido o expirado: sesión muerta
          authService.logout();
          notificacion.info('Sesión finalizada', 'Vuelve a iniciar sesión para continuar.');
          router.navigate(['/login']);
        } else if (
          (apiError.category === ApiErrorCategory.Network || apiError.category === ApiErrorCategory.Server)
          && !esFlujoAuth
        ) {
          notificacion.error(
            apiError.category === ApiErrorCategory.Network ? 'Sin conexión' : 'Error del servidor',
            'No se pudo completar la operación. Inténtalo más tarde.',
          );
          apiError.notificadoGlobalmente = true;
        }

        throw apiError;
      },
    }),
  );
};

function clasificar(err: unknown, url: string): ApiError {
  const base = { url, original: err };

  if (err instanceof HttpErrorResponse) {
    const problema = (err.error ?? {}) as ProblemDetails;
    const init = { ...base, status: err.status, body: problema };

    if (err.status === 0 || err.error instanceof ProgressEvent) {
      return new ApiError({ ...init, category: ApiErrorCategory.Network, message: 'No hay conexión con el servidor.' });
    }

    switch (err.status) {
      case 401: return new ApiError({ ...init, category: ApiErrorCategory.Unauthorized, message: problema.detail ?? 'No autorizado.' });
      case 403: return new ApiError({ ...init, category: ApiErrorCategory.Forbidden, message: problema.detail ?? 'No tienes permisos.' });
      case 404: return new ApiError({ ...init, category: ApiErrorCategory.NotFound, message: problema.detail ?? 'Recurso no encontrado.' });
      case 400: return new ApiError({ ...init, category: ApiErrorCategory.Validation, message: problema.title ?? 'Datos inválidos.' });
      case 409: return new ApiError({ ...init, category: ApiErrorCategory.Conflict, message: problema.detail ?? 'Conflicto con el estado actual.' });
      default:
        if (err.status >= 500) {
          return new ApiError({ ...init, category: ApiErrorCategory.Server, message: problema.title ?? 'Error interno del servidor.' });
        }
        return new ApiError({ ...init, category: ApiErrorCategory.Unknown, message: problema.detail ?? err.message });
    }
  }

  return new ApiError({ ...base, category: ApiErrorCategory.Unknown, message: 'Error inesperado.' });
}

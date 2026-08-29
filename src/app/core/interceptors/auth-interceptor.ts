import { HttpInterceptorFn } from '@angular/common/http';
import { obtenerToken } from '@core/utils/token-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en la bóveda
  const token = obtenerToken();

  // 2. Si existe, clonamos la petición original y le inyectamos la cabecera de Autorización
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // 3. Dejamos que la petición modificada continúe
    return next(clonedRequest);
  }

  // 4. Si no hay token (ej. al hacer login), la dejamos pasar tal cual
  return next(req);
};

/** Clave con la que se guarda/serviría el token JWT en el almacenamiento local de sesión. */
export const JWT_STORAGE_KEY = 'jwt_token';

/** Lee el token JWT de la sesión actual (sessionStorage). */
export function obtenerToken(): string | null {
  return sessionStorage.getItem(JWT_STORAGE_KEY);
}

/** Guarda el token JWT en la sesión actual. */
export function guardarToken(token: string): void {
  sessionStorage.setItem(JWT_STORAGE_KEY, token);
}

/** Elimina el token JWT de la sesión actual. */
export function eliminarToken(): void {
  sessionStorage.removeItem(JWT_STORAGE_KEY);
}

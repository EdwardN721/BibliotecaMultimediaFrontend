export interface RespuestaPrestamoDto {
  id: string;
  userItemId: string;
  nombrePersona: string;
  fechaPrestamo: string;
  /** null/undefined = el título sigue prestado */
  fechaDevolucion?: string | null;
  notas?: string | null;
  estaActivo: boolean;
}

export interface PeticionCrearPrestamoDto {
  nombrePersona: string;
  notas?: string;
  fechaPrestamo?: string;
}

export interface PeticionActualizarPrestamoDto {
  nombrePersona?: string;
  notas?: string;
}

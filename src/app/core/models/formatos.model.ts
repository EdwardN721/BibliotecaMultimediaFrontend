export interface ActualizarFormatoDto {
  nombre: string;
}

export interface AgregarFormatoDto {
  nombre: string;
}

export interface FormatosDto {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActualizarTipoMedioDto {
  nombre: string;
}

export interface AgregarTipoMedioDto {
  nombre: string;
}

export interface TipoMedioDto{
    id: string;
    nombre: string;
    createdAt: string;
    updatedAt?: string;
}
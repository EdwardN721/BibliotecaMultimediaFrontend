export interface ActualizarGeneroDto {
  name: string;
  description?: string;
}

export interface AgregarGeneroDto {
  name: string;
  description?: string;
}

export interface GeneroDto{
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}
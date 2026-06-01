export interface ActualizarPlataformaDto {
  nombre: string;
}

export interface AgregarPlataformaDto {
  nombre: string;
}

export interface PlataformaDto{
    id: string;
    nombre: string;
    createdAt: string;
    updatedAt?: string;
}
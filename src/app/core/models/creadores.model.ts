export interface ActualizarCreadorDto{
    nombre: string;
    biografia?: string;
}

export interface AgregarCreadorDto{
    nombre: string;
    biografia?: string;
}

export interface CreadorDto{
    id: string;
    nombre: string;
    biografia?: string;
    createdAt: string;
    updatedAt?: string;
}
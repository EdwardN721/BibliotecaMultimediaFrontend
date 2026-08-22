export interface AuthResponse {
    token: string;
    user: UsuarioDto;
}

export interface UsuarioDto {
    id: string;
    email: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    phoneNumber?: string;
    nombreCompleto: string;
}

export interface RegistroDto {
    email: string;
    password: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    phoneNumber?: string;
}

export interface UserState {
    isAuthenticated: boolean;
    role: 'Admin' | 'User' | null;
    nombre: string | null;
}

export interface LoginDto {
    email: string;
    password: string;
}

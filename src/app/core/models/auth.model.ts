export interface AuthResponse {
    token: string;
    user: {
    id: string;
    email: string;
    nombre: string;
    nombreCompleto: string;
  };
}

export interface UserState{
    isAuthenticated: boolean;
    role: 'Admin' | 'User' | null;
}

export interface LoginDto{
    email: string;
    password: string;
}
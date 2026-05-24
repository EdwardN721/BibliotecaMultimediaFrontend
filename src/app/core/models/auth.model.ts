export interface AuthResponse {
    token: string;
    role: 'Admin' | 'User';
    userId: string;
}

export interface UserState{
    isAuthenticated: boolean;
    role: 'Admin' | 'User' | null;
}

export interface LoginDto{
    email: string;
    password: string;
}
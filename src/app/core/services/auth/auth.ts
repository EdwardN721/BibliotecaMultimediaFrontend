import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { AuthResponse, LoginDto, RegistroDto, UserState } from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { eliminarToken, guardarToken, obtenerToken } from '@core/utils/token-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/Auth`;

  private userState = signal<UserState>({
    isAuthenticated: false,
    role: null,
    nombre: null,
  });

  public isAuthenticated = computed(() => this.userState().isAuthenticated);
  public isAdmin = computed(() => this.userState().role === 'Admin');
  public isRegularUser = computed(() => this.userState().role === 'User');
  public nombreUsuario = computed(() => this.userState().nombre);

  constructor(private http: HttpClient) {
    this.checkInitialState();
  }

  login(credentials: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // 1. Guardamos el token
        guardarToken(response.token);
        
        // 2. Ejecutamos nuestra nueva función para decodificar
        this.decodeAndSetUser(response.token);
      }),
    );
  }

  registrar(datos: RegistroDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registrar`, datos).pipe(
      tap((response) => {
        // Auto-login: el backend responde 201 con token + usuario
        guardarToken(response.token);
        this.decodeAndSetUser(response.token);
      }),
    );
  }

  logout() {
    eliminarToken();
    this.userState.set({
      isAuthenticated: false,
      role: null,
      nombre: null,
    });
  }

  private checkInitialState() {
    const token = obtenerToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  private decodeAndSetUser(token: string){
    try{
      const decodedToken = jwtDecode<TokenPayload>(token);

      // Token vencido: lo tratamos como sesión inexistente
      const ahoraEnSegundos = Math.floor(Date.now() / 1000);
      if (!decodedToken.exp || decodedToken.exp <= ahoraEnSegundos) {
        this.logout();
        return;
      }

      // ASP.NET puede devolver un string (si hay 1 rol) o un array (si hay varios)
      const roles = decodedToken.role || [];

      // Si el rol es un arreglo y contiene 'Admin', o si el string exacto es 'Admin'
      const isUserAdmin = Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';

      // El nombre viene en el claim Name; con el mapeo por defecto de ASP.NET
      // viaja como 'unique_name' (fallback a 'name')
      const nombre: string | null = decodedToken.unique_name ?? decodedToken.name ?? null;

      this.userState.set({
        isAuthenticated: true,
        role: isUserAdmin ? 'Admin' : 'User',
        nombre,
      });
    } catch {
      this.logout();
    }
  }
}

interface TokenPayload {
  exp?: number;
  role?: string | string[];
  unique_name?: string;
  name?: string;
}

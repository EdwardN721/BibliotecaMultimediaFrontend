import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { AuthResponse, LoginDto, RegistroDto, UserState } from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

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
        localStorage.setItem('jwt_token', response.token);
        
        // 2. Ejecutamos nuestra nueva función para decodificar
        this.decodeAndSetUser(response.token);
      }),
    );
  }

  registrar(datos: RegistroDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registrar`, datos).pipe(
      tap((response) => {
        // Auto-login: el backend responde 201 con token + usuario
        localStorage.setItem('jwt_token', response.token);
        this.decodeAndSetUser(response.token);
      }),
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.userState.set({
      isAuthenticated: false,
      role: null,
      nombre: null,
    });
  }

  private checkInitialState() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  private decodeAndSetUser(token: string){
    try{
      const decodedToken: any = jwtDecode(token);

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
    } catch (error) {
      console.log('Error al decodificar el token', error);
      this.logout();
    }
  }

}

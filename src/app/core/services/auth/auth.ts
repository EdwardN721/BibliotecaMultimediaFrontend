import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse, LoginDto, UserState } from '../../models/auth.model';
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
  });

  public isAuthenticated = computed(() => this.userState().isAuthenticated);
  public isAdmin = computed(() => this.userState().role === 'Admin');
  public isRegularUser = computed(() => this.userState().role === 'User');

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

  logout() {
    localStorage.removeItem('jwt_token');
    this.userState.set({
      isAuthenticated: false,
      role: null,
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

      this.userState.set({
        isAuthenticated: true,
        role: isUserAdmin ? 'Admin' : 'User',
      });
    } catch (error) {
      console.log('Error al decodificar el token', error);
      this.logout();
    }
  }

}

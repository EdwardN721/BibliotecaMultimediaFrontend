import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse, LoginDto, UserState } from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/auth`;

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
        localStorage.setItem('jwt_token', response.token);
        this.userState.set({
          isAuthenticated: true,
          role: response.role,
        });
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
      this.userState.set({ isAuthenticated: true, role: 'User' });
    }
  }
}

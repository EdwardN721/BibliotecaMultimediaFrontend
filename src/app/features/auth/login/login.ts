import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';
import { ThemeService } from '@core/services/theme/theme.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private themeService: ThemeService = inject(ThemeService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  stats = [
    { valor: '+120', label: 'Títulos' },
    { valor: '5', label: 'Tipos de medio' },
    { valor: '24/7', label: 'Tu progreso' },
  ];

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    // La experiencia auth es cinematográfica: siempre en oscuro
    this.themeService.setDarkMode(true);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        if (this.authService.isAdmin()){
          this.router.navigate(['/admin'])
        } else {
          this.router.navigate(['/user'])
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Correo o contraseña incorrectos.');
        this.isLoading.set(false);
      }
    })
  }

}

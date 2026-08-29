import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';
import { ThemeService } from '@core/services/theme/theme.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ApiError } from '@core/models/api-error.model';

/** Espejo de las reglas del backend: mínimo 8 caracteres, una mayúscula y un número. */
const PATRON_CONTRASENA = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const PATRON_TELEFONO = /^\d{10}$/;

function contrasenasCoinciden(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmarPassword = group.get('confirmarPassword')?.value;
  return password && confirmarPassword && password !== confirmarPassword
    ? { noCoinciden: true }
    : null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private themeService: ThemeService = inject(ThemeService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor() {
    // La experiencia auth es cinematográfica: siempre en oscuro
    this.themeService.setDarkMode(true);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  registroForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(100)]],
      segundoApellido: ['', [Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.pattern(PATRON_TELEFONO)]],
      password: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA)]],
      confirmarPassword: ['', [Validators.required]],
    },
    { validators: contrasenasCoinciden },
  );

  get contrasenasNoCoinciden(): boolean {
    const confirmar = this.registroForm.get('confirmarPassword');
    return !!(
      this.registroForm.errors?.['noCoinciden'] &&
      confirmar &&
      (confirmar.touched || confirmar.dirty)
    );
  }

  esInvalido(nombreControl: string): boolean {
    const control = this.registroForm.get(nombreControl);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, nombre, primerApellido, segundoApellido, phoneNumber } =
      this.registroForm.getRawValue();

    this.authService
      .registrar({
        email,
        password,
        nombre,
        primerApellido,
        segundoApellido: segundoApellido || undefined,
        phoneNumber: phoneNumber || undefined,
      })
      .subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
          this.isLoading.set(false);
        },
        error: (err: unknown) => {
          this.errorMessage.set(
            err instanceof ApiError ? err.resumenValidacion : 'No se pudo completar el registro.',
          );
          this.isLoading.set(false);
        },
      });
  }
}

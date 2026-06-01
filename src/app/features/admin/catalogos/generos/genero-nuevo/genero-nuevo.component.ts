import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { AgregarGeneroDto } from '@core/models/generos.model';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

@Component({
  selector: 'app-genero-nuevo.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
  ],
  templateUrl: './genero-nuevo.component.html',
  styleUrl: './genero-nuevo.component.css',
})
export class GeneroNuevoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private generoService: GenerosService = inject(GenerosService);
  private router: Router = inject(Router);
  private notificacion: NotificacionService = inject(NotificacionService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  generoForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
  });

  guardar() {
    if (this.generoForm.invalid) {
      this.generoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: AgregarGeneroDto = this.generoForm.getRawValue();

    this.generoService.agregarGenero(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.exito(
          'Registro exitoso',
          `El genero "${payload.name}" se agregó al catálogo.`,
        );
        this.router.navigate(['/admin/catalogos/generos']);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.notificacion.error(
          'Error al registrar',
          'Ocurrió un error de comunicación con el servidor.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}

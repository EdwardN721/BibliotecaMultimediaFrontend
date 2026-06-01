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
import { MessageService } from 'primeng/api';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { AgregarTipoMedioDto } from '@core/models/tipo.medios.model';

@Component({
  selector: 'app-tipo-medio-nuevo.component',
  standalone: true,
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
  templateUrl: './tipo-medio-nuevo.component.html',
  styleUrl: './tipo-medio-nuevo.component.css',
})
export class TipoMedioNuevoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private tipoMedioService: TipoMediosService = inject(TipoMediosService);
  private router: Router = inject(Router);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  tipoMedioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  guardar() {
    if (this.tipoMedioForm.invalid) {
      this.tipoMedioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: AgregarTipoMedioDto = this.tipoMedioForm.getRawValue();

    this.tipoMedioService.agregarTipoMedio(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `El medio "${payload.nombre}" se agregó al catálogo.`,
        });
        this.router.navigate(['/admin/catalogos/tipo-medios']);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrar',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.isSubmitting.set(false);
      },
    });
  }
}

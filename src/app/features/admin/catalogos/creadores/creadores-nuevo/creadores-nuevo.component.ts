import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { AgregarCreadorDto } from '@core/models/creadores.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-creadores-nuevo.component',
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
  templateUrl: './creadores-nuevo.component.html',
  styleUrl: './creadores-nuevo.component.css',
})
export class CreadoresNuevoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private creadorService: CreadoresService = inject(CreadoresService);
  private router: Router = inject(Router);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  creadorForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    biografia: ['', [Validators.maxLength(1500)]],
  });

  guardar() {
    if (this.creadorForm.invalid) {
      this.creadorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: AgregarCreadorDto = this.creadorForm.getRawValue();

    this.creadorService.agregarCreador(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `El creador "${payload.nombre}" se agregó al catálogo.`,
        });
        this.router.navigate(['/admin/catalogos/creadores']);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo registrar',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.isSubmitting.set(false);
      },
    });
  }
}

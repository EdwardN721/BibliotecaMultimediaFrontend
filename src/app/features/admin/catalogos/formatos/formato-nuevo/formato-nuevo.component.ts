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
import { AgregarFormatoDto } from '@core/models/formatos.model';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';

@Component({
  selector: 'app-formato-nuevo.component',
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
  templateUrl: './formato-nuevo.component.html',
  styleUrl: './formato-nuevo.component.css',
})
export class FormatoNuevoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private formatoService: FormatosService = inject(FormatosService);
  private router: Router = inject(Router);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  formatoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  guardar() {
    if (this.formatoForm.invalid) {
      this.formatoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: AgregarFormatoDto = this.formatoForm.getRawValue();

    this.formatoService.agregarFormato(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `El formato "${payload.nombre}" se agregó al catálogo.`,
        });
        this.router.navigate(['/admin/catalogos/formatos']);
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

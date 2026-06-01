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
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';

@Component({
  selector: 'app-plataforma-nuevo.component',
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
  templateUrl: './plataforma-nuevo.component.html',
  styleUrl: './plataforma-nuevo.component.css',
})
export class PlataformaNuevoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private plataformaService: PlataformasService = inject(PlataformasService);
  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  plataformaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  guardar() {
    if (this.plataformaForm.invalid) {
      this.plataformaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = this.plataformaForm.getRawValue();

    this.plataformaService.agregarPlataforma(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `La plataforma "${payload.nombre}" se agregó al catálogo.`,
        });
        this.router.navigate(['/admin/catalogos/plataformas']);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrar',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.isSubmitting.set(false);
      }
    })
  }
}

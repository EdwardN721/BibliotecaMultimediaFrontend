import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { ActualizarFormatoDto } from '@core/models/formatos.model';

@Component({
  selector: 'app-formato-editar.component',
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
  templateUrl: './formato-editar.component.html',
  styleUrl: './formato-editar.component.css',
})
export class FormatoEditarComponent implements OnInit{
  private fb: FormBuilder = inject(FormBuilder);
  private formatoService: FormatosService = inject(FormatosService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  formatoId: string = '';

  formatoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.formatoId = this.route.snapshot.paramMap.get('id')!;

    this.formatoService.obtenerFormatoPorId(this.formatoId).subscribe({
      next: (creador) => {
        this.formatoForm.patchValue({
          nombre: creador.nombre,
        });
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.router.navigate(['/admin/catalogos/formatos']);
      },
    });
  }

  actualizar(){
    if (this.formatoForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.formatoForm.getRawValue();

    const payload: ActualizarFormatoDto = {
      nombre: formValues.nombre,
    };

    this.formatoService.actualizarFormato(this.formatoId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'info',
          summary: 'Cambios guardados',
          detail: `La información de "${payload.nombre}" ha sido actualizada.`
        });
        this.router.navigate(['/admin/catalogos/formatos']);
      },
      error: (err) => {
        console.error('Error al actualizar el registro:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: 'Los cambios no se pudieron guardar. Verifica tu conexión.'
        });
        this.isSubmitting.set(false);
      }
    });
  }
}

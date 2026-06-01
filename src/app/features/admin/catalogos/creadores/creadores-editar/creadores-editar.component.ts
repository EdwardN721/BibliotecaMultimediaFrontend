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
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActualizarCreadorDto } from '@core/models/creadores.model';

@Component({
  selector: 'app-creadores-editar.component',
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
  templateUrl: './creadores-editar.component.html',
  styleUrl: './creadores-editar.component.css',
})
export class CreadoresEditarComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private creadoresServices: CreadoresService = inject(CreadoresService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  creadorId: string = '';

  creadorForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    biografia: ['', [Validators.maxLength(1500)]],
  });

  ngOnInit() {
    this.creadorId = this.route.snapshot.paramMap.get('id')!;

    this.creadoresServices.obtenerCreadorPorId(this.creadorId).subscribe({
      next: (creador) => {
        this.creadorForm.patchValue({
          nombre: creador.nombre,
          biografia: creador.biografia,
        });
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo obtener información',
          detail: 'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        });
        this.router.navigate(['/admin/catalogos']);
      },
    });
  }

  actualizar(){
    if (this.creadorForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.creadorForm.getRawValue();

    const payload: ActualizarCreadorDto = {
      nombre: formValues.nombre,
      biografia: formValues.biografia
    };

    this.creadoresServices.actualizarCreador(this.creadorId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'info', // El azul (info) es excelente para indicar "actualización"
          summary: 'Cambios guardados',
          detail: `La información de "${payload.nombre}" ha sido actualizada.`
        });
        this.router.navigate(['/admin/items']);
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

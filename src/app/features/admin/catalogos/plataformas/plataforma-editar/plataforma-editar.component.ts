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
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { ActualizarPlataformaDto } from '@core/models/plataformas.model';

@Component({
  selector: 'app-plataforma-editar.component',
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
  templateUrl: './plataforma-editar.component.html',
  styleUrl: './plataforma-editar.component.css',
})
export class PlataformaEditarComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private plataformaServices: PlataformasService = inject(PlataformasService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  plataformaId: string = '';

  plataformaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.plataformaId = this.route.snapshot.paramMap.get('id')!;

    this.plataformaServices.obtenerPlataformaPorId(this.plataformaId).subscribe({
        next: (plataforma) => {
          this.plataformaForm.patchValue({
            nombre: plataforma.nombre
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
        this.router.navigate(['/admin/catalogos']);
      }
    });
  }

  actualizar() {
    if (this.plataformaForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.plataformaForm.getRawValue();

    const payload: ActualizarPlataformaDto = {
      nombre: formValues.nombre
    };

    this.plataformaServices.actualizarPlataforma(this.plataformaId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'info',
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
    })
  }
}

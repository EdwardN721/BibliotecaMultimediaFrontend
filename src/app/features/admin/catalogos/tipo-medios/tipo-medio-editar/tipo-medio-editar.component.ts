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
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { ActualizarTipoMedioDto } from '@core/models/tipo.medios.model';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

@Component({
  selector: 'app-tipo-medio-editar.component',
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
  templateUrl: './tipo-medio-editar.component.html',
  styleUrl: './tipo-medio-editar.component.css',
})
export class TipoMedioEditarComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private tipoMedioService: TipoMediosService = inject(TipoMediosService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private notificacion: NotificacionService = inject(NotificacionService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  tipoMedioId: string = '';

  tipoMedioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.tipoMedioId = this.route.snapshot.paramMap.get('id')!;

    this.tipoMedioService.obtenerTipoMedioPorId(this.tipoMedioId).subscribe({
      next: (creador) => {
        this.tipoMedioForm.patchValue({
          nombre: creador.nombre,
        });
        this.notificacion.exito('Éxito al obtener', 'Éxito al obtener medios.')
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.notificacion.error(
          'Error al obtener',
          'Ocurrió un error de comunicación con el servidor.',
        );
        this.router.navigate(['/admin/catalogos/tipo-medios']);
      },
    });
  }

  actualizar() {
    if (this.tipoMedioForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.tipoMedioForm.getRawValue();

    const payload: ActualizarTipoMedioDto = {
      nombre: formValues.nombre,
    };

    this.tipoMedioService.actualizarTipoMedio(this.tipoMedioId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.info(
          'Cambios guardados',
          `La información de "${payload.nombre}" ha sido actualizada.`,
        );
        this.router.navigate(['/admin/catalogos/tipo-medios']);
      },
      error: (err) => {
        console.error('Error al actualizar el registro:', err);
        this.notificacion.error(
          'Error al actualizar',
          'Los cambios no se pudieron guardar.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}

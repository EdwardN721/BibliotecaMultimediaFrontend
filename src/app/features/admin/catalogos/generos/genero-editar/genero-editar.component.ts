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
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { ActualizarGeneroDto } from '@core/models/generos.model';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';

@Component({
  selector: 'app-genero-editar.component',
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
  templateUrl: './genero-editar.component.html',
  styleUrl: './genero-editar.component.css',
})
export class GeneroEditarComponent implements OnInit{
  private fb: FormBuilder = inject(FormBuilder);
  private generoService: GenerosService = inject(GenerosService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private notificacion: NotificacionService = inject(NotificacionService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  generoId: string = '';

  generoForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
  });

  ngOnInit() {
    this.generoId = this.route.snapshot.paramMap.get('id')!;

    this.generoService.obtenerGeneroPorId(this.generoId).subscribe({
      next: (genero) => {
        this.generoForm.patchValue({
          name: genero.name,
          description: genero.description
        });
        this.notificacion.info('Información obtenida', 'Se obtuvo la información')
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.notificacion.error(
          'Error al obtener',
          'Ocurrió un error de comunicación con el servidor. Inténtalo de nuevo.',
        );
        this.router.navigate(['/admin/catalogos/generos']);
      },
    });
  }

  actualizar() {
    if (this.generoForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.generoForm.getRawValue();

    const payload: ActualizarGeneroDto = {
      name: formValues.name,
      description: formValues.description
    };

    this.generoService.actualizarGenero(this.generoId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.info(
          'Cambios guardados',
          `La información de "${payload.name}" ha sido actualizada.`
        );
        this.router.navigate(['/admin/catalogos/generos']);
      },
      error: (err) => {
        console.error('Error al actualizar el registro:', err);
        this.notificacion.error('Error al actualizar', 'Los cambios no se pudieron guardar.');
        this.isSubmitting.set(false);
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ActualizarTipoMedioDto } from '@core/models/tipo.medios.model';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { EditarCatalogoBase } from '@shared/admin/catalogos/editar-catalogo.base';

@Component({
  selector: 'app-tipo-medio-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
  ],
  templateUrl: './tipo-medio-editar.component.html',
  styleUrl: './tipo-medio-editar.component.css',
})
export class TipoMedioEditarComponent extends EditarCatalogoBase {
  private fb = inject(FormBuilder);
  private tipoMediosService = inject(TipoMediosService);

  protected override nombreEntidad = 'tipo de medio';
  protected override rutaListado = '/admin/catalogos/tipo-medios';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected obtenerDesdeServicio(id: string) {
    return this.tipoMediosService.obtenerTipoMedioPorId(id);
  }

  protected actualizarEnServicio(id: string, payload: Record<string, unknown>) {
    return this.tipoMediosService.actualizarTipoMedio(
      id,
      payload as unknown as ActualizarTipoMedioDto,
    );
  }
}

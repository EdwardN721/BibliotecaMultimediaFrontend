import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { AgregarTipoMedioDto } from '@core/models/tipo.medios.model';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { NuevoCatalogoBase } from '@shared/admin/catalogos/nuevo-catalogo.base';

@Component({
  selector: 'app-tipo-medio-nuevo',
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
  templateUrl: './tipo-medio-nuevo.component.html',
  styleUrl: './tipo-medio-nuevo.component.css',
})
export class TipoMedioNuevoComponent extends NuevoCatalogoBase {
  private fb = inject(FormBuilder);
  private tipoMediosService = inject(TipoMediosService);

  protected override nombreEntidad = 'tipo de medio';
  protected override rutaListado = '/admin/catalogos/tipo-medios';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected crearEnServicio(payload: Record<string, unknown>) {
    return this.tipoMediosService.agregarTipoMedio(payload as unknown as AgregarTipoMedioDto);
  }
}

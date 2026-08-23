import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ActualizarGeneroDto } from '@core/models/generos.model';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { EditarCatalogoBase } from '@shared/admin/catalogos/editar-catalogo.base';

@Component({
  selector: 'app-genero-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
  ],
  templateUrl: './genero-editar.component.html',
  styleUrl: './genero-editar.component.css',
})
export class GeneroEditarComponent extends EditarCatalogoBase {
  private fb = inject(FormBuilder);
  private generosService = inject(GenerosService);

  protected override nombreEntidad = 'género';
  protected override rutaListado = '/admin/catalogos/generos';

  formulario: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
  });

  protected obtenerDesdeServicio(id: string) {
    return this.generosService.obtenerGeneroPorId(id);
  }

  protected actualizarEnServicio(id: string, payload: Record<string, unknown>) {
    return this.generosService.actualizarGenero(id, payload as unknown as ActualizarGeneroDto);
  }
}

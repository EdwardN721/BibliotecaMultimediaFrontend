import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ActualizarCreadorDto } from '@core/models/creadores.model';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { EditarCatalogoBase } from '@shared/admin/catalogos/editar-catalogo.base';

@Component({
  selector: 'app-creadores-editar',
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
  templateUrl: './creadores-editar.component.html',
  styleUrl: './creadores-editar.component.css',
})
export class CreadoresEditarComponent extends EditarCatalogoBase {
  private fb = inject(FormBuilder);
  private creadoresService = inject(CreadoresService);

  protected override nombreEntidad = 'creador';
  protected override rutaListado = '/admin/catalogos/creadores';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    biografia: ['', [Validators.maxLength(1500)]],
  });

  protected obtenerDesdeServicio(id: string) {
    return this.creadoresService.obtenerCreadorPorId(id);
  }

  protected actualizarEnServicio(id: string, payload: Record<string, unknown>) {
    return this.creadoresService.actualizarCreador(id, payload as unknown as ActualizarCreadorDto);
  }
}

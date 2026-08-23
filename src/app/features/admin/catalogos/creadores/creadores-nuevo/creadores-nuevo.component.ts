import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { AgregarCreadorDto } from '@core/models/creadores.model';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { NuevoCatalogoBase } from '@shared/admin/catalogos/nuevo-catalogo.base';

@Component({
  selector: 'app-creadores-nuevo',
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
  templateUrl: './creadores-nuevo.component.html',
  styleUrl: './creadores-nuevo.component.css',
})
export class CreadoresNuevoComponent extends NuevoCatalogoBase {
  private fb = inject(FormBuilder);
  private creadoresService = inject(CreadoresService);

  protected override nombreEntidad = 'creador';
  protected override rutaListado = '/admin/catalogos/creadores';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    biografia: ['', [Validators.maxLength(1500)]],
  });

  protected crearEnServicio(payload: Record<string, unknown>) {
    return this.creadoresService.agregarCreador(payload as unknown as AgregarCreadorDto);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ActualizarFormatoDto } from '@core/models/formatos.model';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { EditarCatalogoBase } from '@shared/admin/catalogos/editar-catalogo.base';

@Component({
  selector: 'app-formato-editar',
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
  templateUrl: './formato-editar.component.html',
  styleUrl: './formato-editar.component.css',
})
export class FormatoEditarComponent extends EditarCatalogoBase {
  private fb = inject(FormBuilder);
  private formatoService = inject(FormatosService);

  protected override nombreEntidad = 'formato';
  protected override rutaListado = '/admin/catalogos/formatos';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected obtenerDesdeServicio(id: string) {
    return this.formatoService.obtenerFormatoPorId(id);
  }

  protected actualizarEnServicio(id: string, payload: Record<string, unknown>) {
    return this.formatoService.actualizarFormato(id, payload as unknown as ActualizarFormatoDto);
  }
}

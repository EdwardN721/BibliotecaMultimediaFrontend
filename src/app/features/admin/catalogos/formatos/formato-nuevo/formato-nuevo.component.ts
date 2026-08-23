import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { AgregarFormatoDto } from '@core/models/formatos.model';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { NuevoCatalogoBase } from '@shared/admin/catalogos/nuevo-catalogo.base';

@Component({
  selector: 'app-formato-nuevo',
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
  templateUrl: './formato-nuevo.component.html',
  styleUrl: './formato-nuevo.component.css',
})
export class FormatoNuevoComponent extends NuevoCatalogoBase {
  private fb = inject(FormBuilder);
  private formatoService = inject(FormatosService);

  protected override nombreEntidad = 'formato';
  protected override rutaListado = '/admin/catalogos/formatos';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected crearEnServicio(payload: Record<string, unknown>) {
    return this.formatoService.agregarFormato(payload as unknown as AgregarFormatoDto);
  }
}

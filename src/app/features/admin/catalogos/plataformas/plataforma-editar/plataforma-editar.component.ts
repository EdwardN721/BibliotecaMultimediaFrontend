import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ActualizarPlataformaDto } from '@core/models/plataformas.model';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { EditarCatalogoBase } from '@shared/admin/catalogos/editar-catalogo.base';

@Component({
  selector: 'app-plataforma-editar',
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
  templateUrl: './plataforma-editar.component.html',
  styleUrl: './plataforma-editar.component.css',
})
export class PlataformaEditarComponent extends EditarCatalogoBase {
  private fb = inject(FormBuilder);
  private plataformasService = inject(PlataformasService);

  protected override nombreEntidad = 'plataforma';
  protected override rutaListado = '/admin/catalogos/plataformas';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected obtenerDesdeServicio(id: string) {
    return this.plataformasService.obtenerPlataformaPorId(id);
  }

  protected actualizarEnServicio(id: string, payload: Record<string, unknown>) {
    return this.plataformasService.actualizarPlataforma(
      id,
      payload as unknown as ActualizarPlataformaDto,
    );
  }
}

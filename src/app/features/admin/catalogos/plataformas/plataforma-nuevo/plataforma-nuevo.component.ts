import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { AgregarPlataformaDto } from '@core/models/plataformas.model';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { NuevoCatalogoBase } from '@shared/admin/catalogos/nuevo-catalogo.base';

@Component({
  selector: 'app-plataforma-nuevo',
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
  templateUrl: './plataforma-nuevo.component.html',
  styleUrl: './plataforma-nuevo.component.css',
})
export class PlataformaNuevoComponent extends NuevoCatalogoBase {
  private fb = inject(FormBuilder);
  private plataformasService = inject(PlataformasService);

  protected override nombreEntidad = 'plataforma';
  protected override rutaListado = '/admin/catalogos/plataformas';

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected crearEnServicio(payload: Record<string, unknown>) {
    return this.plataformasService.agregarPlataforma(payload as unknown as AgregarPlataformaDto);
  }
}

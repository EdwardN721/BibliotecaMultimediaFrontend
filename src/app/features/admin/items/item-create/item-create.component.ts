import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

// Servicios y Modelos
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { ItemService } from '@core/services/items/item.service';
import { GenerosService } from '@core/services/catalogos/generos/generos.service';
import { CreadoresService } from '@core/services/catalogos/creadores/creadores.service';
import { FormatosService } from '@core/services/catalogos/formatos/formatos.service';
import { PlataformasService } from '@core/services/catalogos/plataformas/plataformas.service';
import { TipoMediosService } from '@core/services/catalogos/tipo-medios/tipo-medios.service';
import { GeneroDto } from '@core/models/generos.model';
import { CreadorDto } from '@core/models/creadores.model';
import { FormatosDto } from '@core/models/formatos.model';
import { PlataformaDto } from '@core/models/plataformas.model';
import { TipoMedioDto } from '@core/models/tipo.medios.model';

@Component({
  selector: 'app-item-create.component',
  standalone: true,
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
    SelectModule,
    MultiSelectModule
  ],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.css',
})
export class ItemCreateComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private itemService: ItemService = inject(ItemService);
  private router: Router = inject(Router);
  private notificacion: NotificacionService = inject(NotificacionService);

  // Inyección de catálogos
  private generosService: GenerosService = inject(GenerosService);
  private creadoresService: CreadoresService = inject(CreadoresService);
  private formatosService: FormatosService = inject(FormatosService);
  private plataformasService: PlataformasService = inject(PlataformasService);
  private tipoMedioService: TipoMediosService = inject(TipoMediosService);

  itemForm!: FormGroup;
  isSubmitting: WritableSignal<boolean> = signal(false);
  isLoadingCatalogos: WritableSignal<boolean> = signal(true);

  // Señales para guardar las listas de los dropdowns
  generos: WritableSignal<GeneroDto[]> = signal<GeneroDto[]>([]);
  creadores: WritableSignal<CreadorDto[]> = signal<CreadorDto[]>([]);
  formatos: WritableSignal<FormatosDto[]> = signal<FormatosDto[]>([]);
  plataformas: WritableSignal<PlataformaDto[]> = signal<PlataformaDto[]>([]);
  tiposMedio: WritableSignal<TipoMedioDto[]> = signal<TipoMedioDto[]>([]);

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarCatalogos();
  }
  iniciarFormulario() {
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      descripcion: [''],
      releaseDate: [null],
      rating: [null, [Validators.min(0), Validators.max(10)]],
      isFavorite: [false],
      mediaTypeId: [null, Validators.required],
      formatId: [null, Validators.required],
      platformId: [null],
      genreIds: [[], Validators.required],
      creatorIds: [[]],
    });
  }

  cargarCatalogos(){
    this.isLoadingCatalogos.set(true);

    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };
    const maxSize = 20;

    forkJoin({
      generos: this.generosService.obtenerGeneros(filtroVacio, 1, maxSize),
      creadores: this.creadoresService.obtenerCreadores(filtroVacio, 1, maxSize),
      formatos: this.formatosService.obtenerFormatos(filtroVacio, 1, maxSize),
      plataformas: this.plataformasService.obtenerPlataformas(filtroVacio, 1, maxSize),
      tipoMedios: this.tipoMedioService.obtenerTipoMedios(filtroVacio, 1, maxSize)
    }).subscribe({
      next: (resultados) => {
        this.generos.set(resultados.generos);
        this.creadores.set(resultados.creadores);
        this.formatos.set(resultados.formatos);
        this.plataformas.set(resultados.plataformas);
        this.tiposMedio.set(resultados.tipoMedios);
        this.isLoadingCatalogos.set(false);
      },
      error: (err) =>{
        console.error('Error: ', err)
        this.notificacion.error('Error de Catálogos', 'No se pudieron cargar las opciones.');
        this.isLoadingCatalogos.set(false);
      }
    });
  }

  guardar() {
    if (this.itemForm.invalid){
      this.notificacion.info('Atención', 'Revisa los campos obligatorios.');
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const peticion = this.itemForm.value;

    this.itemService.crearItem(peticion).subscribe({
      next: () => {
        this.notificacion.exito(
          'Registro Exitoso',
          `La obra "${peticion.title}" se guardó en el catálogo.`,
        );
        this.router.navigate(['/admin/items']);
      },
      error: (err) => {
        console.error('Error: ', err);
        this.notificacion.error(
          'Error al guardar',
          'Hubo un problema de comunicación con el servidor.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}

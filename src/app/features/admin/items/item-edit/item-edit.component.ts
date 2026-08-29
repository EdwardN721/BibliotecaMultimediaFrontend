import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ActualizarItemDto } from '@core/models/item.model';
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
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { NotificacionService } from '@core/services/notificacion/notificacion.service';
import { LoggerService } from '@core/services/logger/logger.service';
import { SeccionImagenesComponent } from '../seccion-imagenes/seccion-imagenes.component';

@Component({
  selector: 'app-item-edit',
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
    MultiSelectModule,
    SeccionImagenesComponent,
  ],
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.css',
})
export class ItemEditComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private itemService: ItemService = inject(ItemService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private notificacion: NotificacionService = inject(NotificacionService);
  private logger: LoggerService = inject(LoggerService);

  private generosService: GenerosService = inject(GenerosService);
  private creadoresService: CreadoresService = inject(CreadoresService);
  private formatosService: FormatosService = inject(FormatosService);
  private plataformasService: PlataformasService = inject(PlataformasService);
  private tipoMedioService: TipoMediosService = inject(TipoMediosService);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  isLoadingCatalogos: WritableSignal<boolean> = signal<boolean>(false);
  itemId: string = '';

  generos: WritableSignal<GeneroDto[]> = signal<GeneroDto[]>([]);
  creadores: WritableSignal<CreadorDto[]> = signal<CreadorDto[]>([]);
  formatos: WritableSignal<FormatosDto[]> = signal<FormatosDto[]>([]);
  plataformas: WritableSignal<PlataformaDto[]> = signal<PlataformaDto[]>([]);
  tiposMedio: WritableSignal<TipoMedioDto[]> = signal<TipoMedioDto[]>([]);

  itemForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    releaseDate: [''],
    descripcion: [''],
    metadata: [{}],
    mediaTypeId: [null, Validators.required],
    formatIds: [[]],
    platformIds: [[]],
    genreIds: [[]],
    creatorIds: [[]],
  });

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id')!;

    this.cargarCatalogos();
    this.itemService.obtenerItemPorId(this.itemId).subscribe({
      next: (item) => {
        const fechaLimpia = item.releaseDate ? item.releaseDate.split('T')[0] : '';

        this.itemForm.patchValue({
          title: item.title,
          releaseDate: fechaLimpia,
          descripcion: item.descripcion || '',
          metadata: item.metadata || {},
          mediaTypeId: item.mediaTypeId,
          formatIds: item.formatIds ?? [],
          platformIds: item.platformIds ?? [],
          genreIds: item.genreIds ?? [],
          creatorIds: item.creatorIds ?? [],
        });
        this.isLoadingData.set(false);
        this.enfocarSeccionImagenesSiAplica();
      },
      error: (err) => {
        this.logger.error('item-edit', 'Error al obtener el artículo:', err);
        this.notificacion.error('Error al obtener', 'Error al obtener el artículo.');
        this.isLoadingData.set(false);
        this.router.navigate(['/admin/items']);
      },
    });
  }

  /**
   * Cuando el flujo de creación redirige con ?seccion=imagenes,
   * llevamos al usuario directamente a la sección de imágenes.
   */
  private enfocarSeccionImagenesSiAplica(): void {
    if (this.route.snapshot.queryParamMap.get('seccion') !== 'imagenes') return;

    setTimeout(() => {
      document.getElementById('seccion-imagenes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  cargarCatalogos() {
    this.isLoadingCatalogos.set(true);

    const filtroVacio = { terminoBusqueda: '', ordenadoPor: '', ordenDescendente: true };
    const maxSize = 60;

    forkJoin({
      generos: this.generosService.obtenerGeneros(filtroVacio, 1, maxSize),
      creadores: this.creadoresService.obtenerCreadores(filtroVacio, 1, maxSize),
      formatos: this.formatosService.obtenerFormatos(filtroVacio, 1, maxSize),
      plataformas: this.plataformasService.obtenerPlataformas(filtroVacio, 1, maxSize),
      tipoMedios: this.tipoMedioService.obtenerTipoMedios(filtroVacio, 1, maxSize),
    }).subscribe({
      next: (resultados) => {
        this.generos.set(resultados.generos.registros);
        this.creadores.set(resultados.creadores.registros);
        this.formatos.set(resultados.formatos.registros);
        this.plataformas.set(resultados.plataformas.registros);
        this.tiposMedio.set(resultados.tipoMedios.registros);
        this.isLoadingCatalogos.set(false);
      },
      error: (err) => {
        this.logger.error('item-edit', 'Error al cargar catálogos:', err);
        this.notificacion.error('Error de Catálogos', 'No se pudieron cargar las opciones.');
        this.isLoadingCatalogos.set(false);
      },
    });
  }

  actualizar() {
    if (this.itemForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.itemForm.getRawValue();

    const payload: ActualizarItemDto = {
      title: formValues.title,
      releaseDate: formValues.releaseDate || null,
      descripcion: formValues.descripcion || null,
      metadata: Object.keys(formValues.metadata || {}).length ? formValues.metadata : null,
      mediaTypeId: formValues.mediaTypeId,
      formatIds: formValues.formatIds || [],
      platformIds: formValues.platformIds || [],
      genreIds: formValues.genreIds || [],
      creatorIds: formValues.creatorIds || [],
    };

    this.itemService.actualizarItem(this.itemId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificacion.exito('Cambios guardados', 'Cambios guardados con éxito.');
        this.router.navigate(['/admin/items']);
      },
      error: (err) => {
        this.logger.error('item-edit', 'Error al actualizar el registro:', err);
        this.notificacion.error('Error al actualizar', err.error?.detail ?? 'Ocurrió un error inesperado.');
        this.isSubmitting.set(false);
      },
    });
  }
}
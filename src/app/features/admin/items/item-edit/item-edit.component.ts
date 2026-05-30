import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActualizarItemDto } from '@core/models/item.model';
import { ItemService } from '@core/services/items/item.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-item-edit.component',
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
    InputIconModule
  ],
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.css',
})
export class ItemEditComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private itemService: ItemService = inject(ItemService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingData: WritableSignal<boolean> = signal<boolean>(true);
  itemId: string = '';

  itemForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    releaseDate: ['', [Validators.required]],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    isFavorite: [false],
    descripcion: [''],
    Metadata: [{}],
    mediaTypeId: [''], 
    formatId: [''], 
    platformId: [''], 
    genreIds: [[]], 
    creatorIds: [[]]
  });

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id')!;

    this.itemService.obtenerItemPorId(this.itemId).subscribe({
      next: (item) => {
        const fechaLimpia = item.releaseDate ? item.releaseDate.split('T')[0] : '';

        this.itemForm.patchValue({
          title: item.title,
          releaseDate: fechaLimpia,
          rating: item.rating,
          isFavorite: item.isFavorite,
          descripcion: item.descripcion || '',
          Metadata: item.metadata || {},
          mediaTypeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', 
          formatId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          platformId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          genreIds: [],
          creatorIds: []
        });
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.router.navigate(['/admin/items']);
      },
    });
  }

  actualizar() {
    if (this.itemForm.invalid) return;

    this.isSubmitting.set(true);
    const formValues = this.itemForm.getRawValue();

    // Construcción limpia del body respetando el contrato de ActualizarItemDto
    const payload: ActualizarItemDto = {
      title: formValues.title,
      releaseDate: formValues.releaseDate,
      rating: formValues.rating,
      isFavorite: formValues.isFavorite,
      Metadata: formValues.Metadata || {},
      mediaTypeId: formValues.mediaTypeId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      formatId: formValues.formatId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      platformId: formValues.platformId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      genreIds: formValues.genreIds || [],
      creatorIds: formValues.creatorIds || []
    };

    this.itemService.actualizarItem(this.itemId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/items']);
      },
      error: (err) => {
        console.error('Error al actualizar el registro:', err);
        this.isSubmitting.set(false);
      }
    });
  }
}

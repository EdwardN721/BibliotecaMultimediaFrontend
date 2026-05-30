import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CrearItemDto } from '@core/models/item.model';
import { ItemService } from '@core/services/items/item.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-item-create.component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule,
     InputNumberModule, CheckboxModule],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.css',
})
export class ItemCreateComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private itemService: ItemService = inject(ItemService);
  private router: Router = inject(Router);

  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  
  itemForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    releaseDate: ['', [Validators.required]], 
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    isFavorite: [false],
    Metadata: [{}], // Agregamos el objeto vacío por defecto
    mediaTypeId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'], // IDs temporales
    formatId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    platformId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    genreIds: [[]],
    creatorIds: [[]]
  });

  guardar(){
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: CrearItemDto = this.itemForm.getRawValue();

    this.itemService.crearItem(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['./admin/items']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting.set(false);
      }
    })
  }
}

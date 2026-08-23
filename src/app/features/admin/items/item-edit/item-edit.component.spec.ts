import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditComponent } from './item-edit.component';

describe('ItemEditComponent', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemEditComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

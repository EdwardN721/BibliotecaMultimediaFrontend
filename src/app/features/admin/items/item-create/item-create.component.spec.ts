import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCreateComponent } from './item-create.component';

describe('ItemCreateComponent', () => {
  let component: ItemCreateComponent;
  let fixture: ComponentFixture<ItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCreateComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroEditarComponent } from './genero-editar.component';

describe('GeneroEditarComponent', () => {
  let component: GeneroEditarComponent;
  let fixture: ComponentFixture<GeneroEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneroEditarComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(GeneroEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

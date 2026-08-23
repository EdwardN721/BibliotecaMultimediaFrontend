import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroNuevoComponent } from './genero-nuevo.component';

describe('GeneroNuevoComponent', () => {
  let component: GeneroNuevoComponent;
  let fixture: ComponentFixture<GeneroNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneroNuevoComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(GeneroNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

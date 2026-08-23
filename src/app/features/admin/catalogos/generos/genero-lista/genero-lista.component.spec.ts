import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroListaComponent } from './genero-lista.component';

describe('GeneroListaComponent', () => {
  let component: GeneroListaComponent;
  let fixture: ComponentFixture<GeneroListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneroListaComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(GeneroListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

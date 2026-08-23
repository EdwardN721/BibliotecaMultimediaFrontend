import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMedioListaComponent } from './tipo-medio-lista.component';

describe('TipoMedioListaComponent', () => {
  let component: TipoMedioListaComponent;
  let fixture: ComponentFixture<TipoMedioListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoMedioListaComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(TipoMedioListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

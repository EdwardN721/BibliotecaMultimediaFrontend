import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMedioNuevoComponent } from './tipo-medio-nuevo.component';

describe('TipoMedioNuevoComponent', () => {
  let component: TipoMedioNuevoComponent;
  let fixture: ComponentFixture<TipoMedioNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoMedioNuevoComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(TipoMedioNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

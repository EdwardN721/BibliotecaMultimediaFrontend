import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaEditarComponent } from './plataforma-editar.component';

describe('PlataformaEditarComponent', () => {
  let component: PlataformaEditarComponent;
  let fixture: ComponentFixture<PlataformaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlataformaEditarComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(PlataformaEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

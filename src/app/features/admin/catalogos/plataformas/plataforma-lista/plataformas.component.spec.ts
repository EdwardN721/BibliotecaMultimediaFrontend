import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaListaComponent } from './plataformas.component';

describe('PlataformaListaComponent', () => {
  let component: PlataformaListaComponent;
  let fixture: ComponentFixture<PlataformaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlataformaListaComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(PlataformaListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

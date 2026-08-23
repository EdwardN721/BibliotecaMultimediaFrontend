import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoEditarComponent } from './formato-editar.component';

describe('FormatoEditarComponent', () => {
  let component: FormatoEditarComponent;
  let fixture: ComponentFixture<FormatoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatoEditarComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(FormatoEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

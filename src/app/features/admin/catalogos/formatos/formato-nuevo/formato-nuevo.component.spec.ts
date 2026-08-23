import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoNuevoComponent } from './formato-nuevo.component';

describe('FormatoNuevoComponent', () => {
  let component: FormatoNuevoComponent;
  let fixture: ComponentFixture<FormatoNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatoNuevoComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(FormatoNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

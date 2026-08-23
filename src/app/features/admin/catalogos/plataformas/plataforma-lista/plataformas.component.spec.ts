import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformasComponent } from './plataformas.component';

describe('PlataformasComponent', () => {
  let component: PlataformasComponent;
  let fixture: ComponentFixture<PlataformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlataformasComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(PlataformasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

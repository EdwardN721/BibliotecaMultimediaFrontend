import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMedioEditarComponent } from './tipo-medio-editar.component';

describe('TipoMedioEditarComponent', () => {
  let component: TipoMedioEditarComponent;
  let fixture: ComponentFixture<TipoMedioEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoMedioEditarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoMedioEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

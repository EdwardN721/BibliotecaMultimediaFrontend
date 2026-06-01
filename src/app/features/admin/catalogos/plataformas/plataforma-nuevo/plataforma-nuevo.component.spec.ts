import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaNuevoComponent } from './plataforma-nuevo.component';

describe('PlataformaNuevoComponent', () => {
  let component: PlataformaNuevoComponent;
  let fixture: ComponentFixture<PlataformaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlataformaNuevoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlataformaNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

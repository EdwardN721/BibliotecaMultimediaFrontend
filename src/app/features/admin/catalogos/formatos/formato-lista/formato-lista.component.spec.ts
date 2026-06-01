import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoListaComponent } from './formato-lista.component';

describe('FormatoListaComponent', () => {
  let component: FormatoListaComponent;
  let fixture: ComponentFixture<FormatoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatoListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormatoListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadoresEditarComponent } from './creadores-editar.component';

describe('CreadoresEditarComponent', () => {
  let component: CreadoresEditarComponent;
  let fixture: ComponentFixture<CreadoresEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadoresEditarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreadoresEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

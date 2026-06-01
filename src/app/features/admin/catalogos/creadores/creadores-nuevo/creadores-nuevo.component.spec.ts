import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadoresNuevoComponent } from './creadores-nuevo.component';

describe('CreadoresNuevoComponent', () => {
  let component: CreadoresNuevoComponent;
  let fixture: ComponentFixture<CreadoresNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadoresNuevoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreadoresNuevoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

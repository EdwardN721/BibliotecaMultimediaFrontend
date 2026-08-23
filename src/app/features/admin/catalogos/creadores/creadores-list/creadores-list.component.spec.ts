import { PROVEEDORES_TEST } from '@testing/test-bed-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadoresListComponent } from './creadores-list.component';

describe('CreadoresListComponent', () => {
  let component: CreadoresListComponent;
  let fixture: ComponentFixture<CreadoresListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadoresListComponent],
      providers: PROVEEDORES_TEST,
    }).compileComponents();

    fixture = TestBed.createComponent(CreadoresListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

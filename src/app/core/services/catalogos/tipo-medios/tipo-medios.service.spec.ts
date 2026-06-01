import { TestBed } from '@angular/core/testing';

import { TipoMediosService } from './tipo-medios.service';

describe('TipoMediosService', () => {
  let service: TipoMediosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMediosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

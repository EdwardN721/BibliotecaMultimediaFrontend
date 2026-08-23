import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
    service = TestBed.inject(NotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

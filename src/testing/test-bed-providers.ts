import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

/**
 * Providers comunes para los tests de componentes y servicios:
 * HTTP mockeado (HttpTestingController), router y toasts de PrimeNG.
 *
 * TestBed.resetTestingModule() limpia la configuración global del test-setup
 * antes de cada test, por lo que cada spec debe declararlos explícitamente.
 */
export const PROVEEDORES_TEST = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  MessageService,
  ConfirmationService,
];

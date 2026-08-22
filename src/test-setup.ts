import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

TestBed.configureTestingModule({
  providers: [
    MessageService,
    ConfirmationService,
    provideRouter([{ path: '**', redirectTo: '' }]),
    {
      provide: ActivatedRoute,
      useValue: {
        snapshot: {
          paramMap: convertToParamMap({}),
          params: {},
        },
      },
    },
  ],
});
export enum ApiErrorCategory {
  Network = 'NETWORK',
  Timeout = 'TIMEOUT',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  Validation = 'VALIDATION',
  Conflict = 'CONFLICT',
  Server = 'SERVER',
  Unknown = 'UNKNOWN',
}

export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiErrorInit {
  category: ApiErrorCategory;
  message: string;
  status?: number;
  url?: string;
  method?: string;
  body?: ProblemDetails | unknown;
  original?: unknown;
}

export class ApiError extends Error {
  readonly category: ApiErrorCategory;
  readonly status?: number;
  readonly url?: string;
  readonly method?: string;
  readonly timestamp: Date;
  readonly original: unknown;

  /** Cuerpo del backend (ProblemDetails). Mantiene compatibilidad con `err.error?.detail`. */
  readonly error?: ProblemDetails | unknown;

  /** true si el interceptor ya mostró un toast global por este error. */
  notificadoGlobalmente = false;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = 'ApiError';
    this.category = init.category;
    this.status = init.status;
    this.url = init.url;
    this.method = init.method;
    this.error = init.body;
    this.timestamp = new Date();
    this.original = init.original;
  }

  get esErrorDeSesion(): boolean {
    return (
      this.category === ApiErrorCategory.Unauthorized ||
      this.category === ApiErrorCategory.Forbidden
    );
  }

  /** Une los mensajes de validación del backend en un solo string. */
  get resumenValidacion(): string {
    const errors = (this.error as ProblemDetails)?.errors;
    if (!errors) return this.message;
    return Object.values(errors).flat().join(' ');
  }
}

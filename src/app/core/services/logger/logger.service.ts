import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

type NivelLog = 'debug' | 'info' | 'warn' | 'error';

/**
 * Facade central de logging. Permite centralizar el registro y, en producción,
 * omitir los niveles informativos (debug/info) para reducir ruido mientras se
 * conservan warning y error.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly produccion = environment.production;

  debug(contexto: string, ...datos: unknown[]): void {
    if (this.produccion) return;
    this.emitir('debug', contexto, datos);
  }

  info(contexto: string, ...datos: unknown[]): void {
    if (this.produccion) return;
    this.emitir('info', contexto, datos);
  }

  warn(contexto: string, ...datos: unknown[]): void {
    this.emitir('warn', contexto, datos);
  }

  error(contexto: string, ...datos: unknown[]): void {
    this.emitir('error', contexto, datos);
  }

  private emitir(nivel: NivelLog, contexto: string, datos: unknown[]): void {
    console[nivel](`[${contexto}]`, ...datos);
  }
}

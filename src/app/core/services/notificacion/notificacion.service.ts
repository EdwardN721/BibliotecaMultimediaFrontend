import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private messageService: MessageService = inject(MessageService);

  private readonly globalStyle = 'p-4 rounded-2xl shadow-xl';

  exito(titulo: string, mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: titulo,
      detail: mensaje,
      styleClass: this.globalStyle,
    });
  }

  error(titulo: string, mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: titulo,
      detail: mensaje,
      styleClass: this.globalStyle,
    });
  }

  info(titulo: string, mensaje: string) {
    this.messageService.add({
      severity: 'info',
      summary: titulo,
      detail: mensaje,
      styleClass: this.globalStyle,
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCDMX',
  standalone: true,
})
export class FechaCdmxPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '-';

    const date = new Date(value);

    const formateador = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    let fechaFormateada = formateador.format(date);

    fechaFormateada = fechaFormateada.replace(' a.m.', ' AM').replace(' p.m.', ' PM');

    return fechaFormateada;
  }
}

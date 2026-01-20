import { Pipe, PipeTransform } from '@angular/core';

type DateFormatType = 'short' | 'medium' | 'long' | 'full';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: DateFormatType = 'short'): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    switch (format) {
      case 'short':
        // 19/01/2026
        return `${day}/${month}/${year}`;

      case 'medium':
        // 19 Ene 2026
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${day} ${monthNames[date.getMonth()]} ${year}`;

      case 'long':
        // 19/01/2026 15:30
        return `${day}/${month}/${year} ${hours}:${minutes}`;

      case 'full':
        // 19 de Enero de 2026, 15:30
        const fullMonthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${day} de ${fullMonthNames[date.getMonth()]} de ${year}, ${hours}:${minutes}`;

      default:
        return `${day}/${month}/${year}`;
    }
  }

}

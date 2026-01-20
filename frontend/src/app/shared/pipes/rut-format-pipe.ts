import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rutFormat',
  standalone: true
})
export class RutFormatPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove all non-alphanumeric characters
    const cleanRut = value.replace(/[^0-9kK]/g, '');

    if (cleanRut.length < 2) {
      return cleanRut;
    }

    // Split into body and verifier
    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();

    // Format body with dots (12.345.678)
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Return formatted RUT (12.345.678-9)
    return `${formattedBody}-${verifier}`;
  }

}

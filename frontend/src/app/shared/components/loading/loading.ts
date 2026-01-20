import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  message = input<string>('Cargando...');
  diameter = input<number>(50);
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ObrasService } from '../../../core/services/obras.service';
import { Obra } from '../../../core/models/obra.model';
import { Loading } from '../../../shared/components';
import { RutFormatPipe } from '../../../shared/pipes/rut-format-pipe';

@Component({
  selector: 'app-obras-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    Loading,
    RutFormatPipe
  ],
  templateUrl: './obras-detail.html',
  styleUrl: './obras-detail.scss'
})
export class ObrasDetailComponent implements OnInit {
  private obrasService = inject(ObrasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  obra = signal<Obra | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadObra(parseInt(id, 10));
    }
  }

  private loadObra(id: number): void {
    this.loading.set(true);
    this.obrasService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.obra.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading obra:', error);
        this.loading.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/obras']);
  }

  onEdit(): void {
    const obraData = this.obra();
    if (obraData) {
      this.router.navigate(['/obras', obraData.id, 'editar']);
    }
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' | '' {
    switch (estado) {
      case 'en_curso':
        return 'primary';
      case 'planificacion':
        return 'accent';
      case 'suspendida':
        return 'warn';
      case 'finalizada':
        return '';
      default:
        return '';
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'planificacion': 'Planificación',
      'en_curso': 'En Curso',
      'suspendida': 'Suspendida',
      'finalizada': 'Finalizada'
    };
    return labels[estado] || estado;
  }

  getEstadoIcon(estado: string): string {
    const icons: { [key: string]: string } = {
      'planificacion': 'schedule',
      'en_curso': 'construction',
      'suspendida': 'pause_circle',
      'finalizada': 'check_circle'
    };
    return icons[estado] || 'info';
  }
}

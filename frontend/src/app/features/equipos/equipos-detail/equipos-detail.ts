import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { EquiposService } from '../../../core/services/equipos.service';
import { Equipo, ComponenteEquipo } from '../../../core/models/equipo.model';
import { Loading } from '../../../shared/components';

@Component({
  selector: 'app-equipos-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    Loading
  ],
  templateUrl: './equipos-detail.html',
  styleUrl: './equipos-detail.scss'
})
export class EquiposDetailComponent implements OnInit {
  private equiposService = inject(EquiposService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  equipo = signal<Equipo | null>(null);
  componentes = signal<ComponenteEquipo[]>([]);
  loading = signal(false);

  displayedColumns: string[] = ['nombre', 'unidad', 'precio_unitario_uf'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEquipo(parseInt(id, 10));
    }
  }

  private loadEquipo(id: number): void {
    this.loading.set(true);
    this.equiposService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.equipo.set(response.data);
          if (response.data.componentes) {
            this.componentes.set(response.data.componentes);
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading equipo:', error);
        this.loading.set(false);
        this.router.navigate(['/equipos']);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/equipos']);
  }

  onEdit(): void {
    const equipoData = this.equipo();
    if (equipoData) {
      this.router.navigate(['/equipos', equipoData.id, 'editar']);
    }
  }

  getEspecificacionesDisplay(): string {
    const equipoData = this.equipo();
    if (!equipoData?.especificaciones) return 'N/A';

    if (typeof equipoData.especificaciones === 'string') {
      return equipoData.especificaciones;
    }

    return JSON.stringify(equipoData.especificaciones, null, 2);
  }
}

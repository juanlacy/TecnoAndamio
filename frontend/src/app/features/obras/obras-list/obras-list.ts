import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { ObrasService } from '../../../core/services/obras.service';
import { ClientesService } from '../../../features/clientes/clientes.service';
import { Obra } from '../../../core/models/obra.model';
import { Cliente } from '../../../core/models';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-obras-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './obras-list.html',
  styleUrl: './obras-list.scss'
})
export class ObrasListComponent implements OnInit {
  private obrasService = inject(ObrasService);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  obras = signal<Obra[]>([]);
  filteredObras = signal<Obra[]>([]);
  clientesActivos = signal<Cliente[]>([]);
  loading = signal(false);

  searchTerm = '';
  filtroCliente: number | null = null;
  filtroEstado: string | null = null;

  displayedColumns: string[] = ['codigo', 'nombre', 'cliente', 'ciudad', 'fecha_inicio', 'estado', 'activo', 'actions'];

  ngOnInit(): void {
    this.loadObras();
    this.loadClientesActivos();
  }

  loadObras(): void {
    this.loading.set(true);
    this.obrasService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.obras.set(response.data);
          this.applyFilters();
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading obras:', error);
        this.snackBar.open('Error al cargar obras', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  loadClientesActivos(): void {
    this.clientesService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          const activos = response.data.filter(c => c.activo);
          this.clientesActivos.set(activos);
        }
      },
      error: (error) => {
        console.error('Error loading clientes:', error);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.obras();

    // Filtro por búsqueda de texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(obra =>
        obra.codigo.toLowerCase().includes(term) ||
        obra.nombre.toLowerCase().includes(term)
      );
    }

    // Filtro por cliente
    if (this.filtroCliente) {
      filtered = filtered.filter(obra => obra.cliente_id === this.filtroCliente);
    }

    // Filtro por estado
    if (this.filtroEstado) {
      filtered = filtered.filter(obra => obra.estado === this.filtroEstado);
    }

    this.filteredObras.set(filtered);
  }

  onCreate(): void {
    this.router.navigate(['/obras/nuevo']);
  }

  onView(obra: Obra): void {
    this.router.navigate(['/obras', obra.id]);
  }

  onEdit(obra: Obra): void {
    this.router.navigate(['/obras', obra.id, 'editar']);
  }

  onDelete(obra: Obra): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar Obra',
        message: `¿Está seguro de que desea eliminar la obra "${obra.nombre}"?`,
        confirmText: 'Eliminar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obrasService.delete(obra.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Obra eliminada correctamente', 'Cerrar', { duration: 3000 });
              this.loadObras();
            }
          },
          error: (error) => {
            console.error('Error deleting obra:', error);
            this.snackBar.open('Error al eliminar obra', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
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

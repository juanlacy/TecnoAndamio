import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { EquiposService } from '../../../core/services/equipos.service';
import { CategoriasEquiposService } from '../../../core/services/categorias-equipos.service';
import { Equipo, CategoriaEquipo } from '../../../core/models/equipo.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-equipos-list',
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
  templateUrl: './equipos-list.html',
  styleUrl: './equipos-list.scss'
})
export class EquiposListComponent implements OnInit {
  private equiposService = inject(EquiposService);
  private categoriasService = inject(CategoriasEquiposService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  equipos = signal<Equipo[]>([]);
  dataSource = new MatTableDataSource<Equipo>([]);
  categorias = signal<CategoriaEquipo[]>([]);
  loading = signal(false);

  searchTerm = '';
  filtroCategoria: number | null = null;
  filtroDisponible: boolean | null = null;

  displayedColumns: string[] = ['codigo', 'nombre', 'categoria', 'disponible', 'activo', 'actions'];

  ngOnInit(): void {
    this.loadEquipos();
    this.loadCategorias();
  }

  loadEquipos(): void {
    this.loading.set(true);
    this.equiposService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.equipos.set(response.data);
          this.applyFilters();
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading equipos:', error);
        this.snackBar.open('Error al cargar equipos', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  loadCategorias(): void {
    this.categoriasService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          const activas = response.data.filter(c => c.activo);
          this.categorias.set(activas);
        }
      },
      error: (error) => {
        console.error('Error loading categorias:', error);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.equipos();

    // Filtro por búsqueda de texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(equipo =>
        equipo.nombre.toLowerCase().includes(term) ||
        (equipo.codigo && equipo.codigo.toLowerCase().includes(term))
      );
    }

    // Filtro por categoría
    if (this.filtroCategoria) {
      filtered = filtered.filter(equipo => equipo.categoria_id === this.filtroCategoria);
    }

    // Filtro por disponibilidad
    if (this.filtroDisponible !== null) {
      filtered = filtered.filter(equipo => equipo.disponible === this.filtroDisponible);
    }

    this.dataSource.data = filtered;
  }

  onCreate(): void {
    this.router.navigate(['/equipos/nuevo']);
  }

  onView(equipo: Equipo): void {
    this.router.navigate(['/equipos', equipo.id]);
  }

  onEdit(equipo: Equipo): void {
    this.router.navigate(['/equipos', equipo.id, 'editar']);
  }

  onDelete(equipo: Equipo): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar Equipo',
        message: `¿Está seguro de que desea eliminar el equipo "${equipo.nombre}"?`,
        confirmText: 'Eliminar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.equiposService.delete(equipo.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Equipo eliminado correctamente', 'Cerrar', { duration: 3000 });
              this.loadEquipos();
            }
          },
          error: (error) => {
            console.error('Error deleting equipo:', error);
            this.snackBar.open('Error al eliminar equipo', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  get hasData(): boolean {
    return this.dataSource.data.length > 0;
  }

  get totalEquipos(): number {
    return this.dataSource.data.length;
  }
}

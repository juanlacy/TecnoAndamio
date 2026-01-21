import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-usuarios-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss'
})
export class UsuariosListComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  usuarios = signal<Usuario[]>([]);
  dataSource = new MatTableDataSource<Usuario>([]);
  loading = signal(false);
  searchTerm = signal('');

  displayedColumns: string[] = ['id', 'nombre', 'email', 'rol', 'activo', 'actions'];

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuariosService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.dataSource.data = usuarios;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading usuarios:', error);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm.set(term);

    if (!term) {
      this.dataSource.data = this.usuarios();
      return;
    }

    const filtered = this.usuarios().filter(usuario =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term) ||
      (usuario.rol && usuario.rol.toLowerCase().includes(term)) ||
      (usuario.roles && usuario.roles.some(r => r.toLowerCase().includes(term)))
    );
    this.dataSource.data = filtered;
  }

  onCreate(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  onView(usuario: Usuario): void {
    this.router.navigate(['/usuarios', usuario.id]);
  }

  onEdit(usuario: Usuario): void {
    this.router.navigate(['/usuarios', usuario.id, 'editar']);
  }

  onDelete(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar Usuario',
        message: `¿Está seguro que desea eliminar al usuario "${usuario.nombre}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuariosService.delete(usuario.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error deleting usuario:', error);
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  onToggleActive(usuario: Usuario, event: Event): void {
    event.stopPropagation();
    const newStatus = !usuario.activo;

    this.usuariosService.toggleActive(usuario.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(
          `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Error toggling usuario status:', error);
        this.snackBar.open('Error al cambiar estado del usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getRolColor(rol: string): string {
    switch (rol) {
      case 'admin':
        return 'warn';
      case 'usuario':
        return 'primary';
      default:
        return 'accent';
    }
  }

  getRolLabel(rol: string): string {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'usuario':
        return 'Usuario';
      default:
        return rol;
    }
  }

  get hasData(): boolean {
    return this.dataSource.data.length > 0;
  }

  get totalUsuarios(): number {
    return this.dataSource.data.length;
  }
}

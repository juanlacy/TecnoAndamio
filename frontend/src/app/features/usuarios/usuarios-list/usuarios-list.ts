import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';

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
    MatProgressSpinnerModule,
    MatButtonToggleModule
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
  viewMode = signal<'cards' | 'table'>('cards');
  selectedRole = signal<string>('');
  showOnlyActive = signal(false);

  filteredUsuarios = computed(() => {
    let filtered = this.usuarios();

    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(usuario =>
        usuario.nombre.toLowerCase().includes(term) ||
        usuario.email.toLowerCase().includes(term) ||
        (usuario.rol && usuario.rol.toLowerCase().includes(term)) ||
        (usuario.roles && usuario.roles.some(r => r.toLowerCase().includes(term)))
      );
    }

    // Filtrar por rol
    if (this.selectedRole()) {
      filtered = filtered.filter(usuario => usuario.rol === this.selectedRole());
    }

    // Filtrar por activos
    if (this.showOnlyActive()) {
      filtered = filtered.filter(usuario => usuario.activo);
    }

    return filtered;
  });

  displayedColumns: string[] = ['id', 'nombre', 'email', 'rol', 'activo', 'actions'];

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuariosService.getAll().subscribe({
      next: (response) => {
        if (response.success) { this.usuarios.set(response.data); this.dataSource.data = response.data; }
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
    this.updateDataSource();
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
          next: (response) => {
          if (!response.success) return;
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
      next: (response) => {
          if (!response.success) return;
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

  onChangePassword(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '500px',
      data: {
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // La contraseña se cambió exitosamente
        // El snackbar ya se mostró en el diálogo
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

  onViewModeChange(event: any): void {
    this.viewMode.set(event.value);
  }

  filterByRole(role: string): void {
    this.selectedRole.set(role);
    this.updateDataSource();
  }

  filterByActive(active: boolean): void {
    this.showOnlyActive.set(active);
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource.data = this.filteredUsuarios();
  }

  get hasData(): boolean {
    return this.filteredUsuarios().length > 0;
  }

  get totalUsuarios(): number {
    return this.usuarios().length;
  }
}

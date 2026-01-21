import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.model';
import { Loading } from '../../../shared/components/loading/loading';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-usuarios-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    Loading,
    DatePipe
  ],
  templateUrl: './usuarios-detail.html',
  styleUrl: './usuarios-detail.scss'
})
export class UsuariosDetailComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  usuario = signal<Usuario | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUsuario(+id);
    } else {
      this.router.navigate(['/usuarios']);
    }
  }

  loadUsuario(id: number): void {
    this.loading.set(true);
    this.usuariosService.getById(id).subscribe({
      next: (response) => {
        if (response.success) { this.usuario.set(response.data); }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading usuario:', error);
        this.snackBar.open('Error al cargar el usuario', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/usuarios']);
        this.loading.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/usuarios']);
  }

  onEdit(): void {
    const usuario = this.usuario();
    if (usuario) {
      this.router.navigate(['/usuarios', usuario.id, 'editar']);
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
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { ClientesService } from './clientes.service';
import { Cliente } from '../../core/models';
import { RutFormatPipe } from '../../shared/pipes';
import { Loading, ConfirmDialog, ConfirmDialogData } from '../../shared/components';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    RutFormatPipe,
    Loading
  ],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss',
})
export class ClientesList implements OnInit {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  searchTerm = signal('');

  displayedColumns: string[] = ['rut', 'nombre', 'email', 'telefono', 'activo', 'acciones'];

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading.set(true);
    const search = this.searchTerm();

    this.clientesService.getAll(search ? { search } : undefined).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clientes:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.loadClientes();
  }

  onCreate(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  onDelete(cliente: Cliente): void {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Cliente',
      message: `¿Está seguro que desea eliminar al cliente "${cliente.razon_social}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientesService.delete(cliente.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadClientes();
            }
          },
          error: (error) => {
            console.error('Error deleting cliente:', error);
          }
        });
      }
    });
  }

  onView(cliente: Cliente): void {
    this.router.navigate(['/clientes/ver', cliente.id]);
  }
}

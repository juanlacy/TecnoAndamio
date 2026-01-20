import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ClientesService } from './clientes.service';
import { Cliente } from '../../core/models';
import { RutFormatPipe } from '../../shared/pipes';
import { DateFormatPipe } from '../../shared/pipes';
import { Loading } from '../../shared/components';

@Component({
  selector: 'app-clientes-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RutFormatPipe,
    DateFormatPipe,
    Loading
  ],
  templateUrl: './clientes-detail.html',
  styleUrl: './clientes-detail.scss',
})
export class ClientesDetail implements OnInit {
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cliente = signal<Cliente | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCliente(parseInt(id, 10));
    }
  }

  private loadCliente(id: number): void {
    this.loading.set(true);
    this.clientesService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.cliente.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading cliente:', error);
        this.loading.set(false);
        this.router.navigate(['/clientes']);
      }
    });
  }

  onEdit(): void {
    const clienteData = this.cliente();
    if (clienteData) {
      this.router.navigate(['/clientes/editar', clienteData.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/clientes']);
  }
}

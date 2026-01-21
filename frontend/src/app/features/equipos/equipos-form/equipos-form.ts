import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EquiposService } from '../../../core/services/equipos.service';
import { CategoriasEquiposService } from '../../../core/services/categorias-equipos.service';
import { Equipo, CreateEquipoDto, UpdateEquipoDto, CategoriaEquipo } from '../../../core/models/equipo.model';
import { Loading } from '../../../shared/components';

@Component({
  selector: 'app-equipos-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    Loading
  ],
  templateUrl: './equipos-form.html',
  styleUrl: './equipos-form.scss'
})
export class EquiposFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private equiposService = inject(EquiposService);
  private categoriasService = inject(CategoriasEquiposService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  equipoForm!: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  equipoId: number | null = null;
  categorias = signal<CategoriaEquipo[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();
    this.checkEditMode();
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      categoria_id: [null, [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: [''],
      descripcion: [''],
      especificaciones: [''],
      disponible: [true],
      activo: [true]
    });
  }

  private loadCategorias(): void {
    this.categoriasService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          const activas = response.data.filter(c => c.activo);
          this.categorias.set(activas);
        }
      },
      error: (error) => {
        console.error('Error loading categorias:', error);
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.equipoId = parseInt(id, 10);
      this.isEditMode.set(true);
      this.loadEquipo(this.equipoId);
    }
  }

  private loadEquipo(id: number): void {
    this.loading.set(true);
    this.equiposService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const equipo = response.data;
          this.equipoForm.patchValue({
            categoria_id: equipo.categoria_id,
            nombre: equipo.nombre,
            codigo: equipo.codigo,
            descripcion: equipo.descripcion,
            especificaciones: equipo.especificaciones ? JSON.stringify(equipo.especificaciones, null, 2) : '',
            disponible: equipo.disponible,
            activo: equipo.activo
          });
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading equipo:', error);
        this.snackBar.open('Error al cargar equipo', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
        this.router.navigate(['/equipos']);
      }
    });
  }

  onSubmit(): void {
    if (this.equipoForm.invalid) {
      this.equipoForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const formValue = { ...this.equipoForm.value };

    // Parsear especificaciones JSON si existe
    if (formValue.especificaciones) {
      try {
        formValue.especificaciones = JSON.parse(formValue.especificaciones);
      } catch (e) {
        // Si no es JSON válido, guardarlo como string
        formValue.especificaciones = { descripcion: formValue.especificaciones };
      }
    }

    if (this.isEditMode() && this.equipoId) {
      this.equiposService.update(this.equipoId, formValue as UpdateEquipoDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Equipo actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/equipos']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating equipo:', error);
          this.snackBar.open(error.error?.message || 'Error al actualizar equipo', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
    } else {
      this.equiposService.create(formValue as CreateEquipoDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Equipo creado correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/equipos']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating equipo:', error);
          this.snackBar.open(error.error?.message || 'Error al crear equipo', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/equipos']);
  }

  getErrorMessage(field: string): string {
    const control = this.equipoForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }
}

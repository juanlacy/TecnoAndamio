import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ObrasService } from '../../../core/services/obras.service';
import { ClientesService } from '../../clientes/clientes.service';
import { Obra, CreateObraDto, UpdateObraDto } from '../../../core/models/obra.model';
import { Cliente } from '../../../core/models';
import { Loading } from '../../../shared/components';
import { RutFormatPipe } from '../../../shared/pipes/rut-format-pipe';

@Component({
  selector: 'app-obras-form',
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
    Loading,
    RutFormatPipe
  ],
  templateUrl: './obras-form.html',
  styleUrl: './obras-form.scss',
})
export class ObrasFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private obrasService = inject(ObrasService);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  obraForm!: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  obraId: number | null = null;
  clientesActivos = signal<Cliente[]>([]);

  estadosObra = [
    { value: 'planificacion', label: 'Planificación', icon: 'schedule' },
    { value: 'en_curso', label: 'En Curso', icon: 'construction' },
    { value: 'suspendida', label: 'Suspendida', icon: 'pause_circle' },
    { value: 'finalizada', label: 'Finalizada', icon: 'check_circle' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadClientesActivos();
    this.checkEditMode();
    this.setupFechaValidation();
  }

  private initForm(): void {
    this.obraForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      cliente_id: [null, [Validators.required]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_termino_estimada: ['', [this.dateRangeValidator.bind(this)]],
      estado: ['planificacion', [Validators.required]],
      activo: [true]
    });
  }

  private setupFechaValidation(): void {
    // Re-validar fecha_termino cuando cambie fecha_inicio
    this.obraForm.get('fecha_inicio')?.valueChanges.subscribe(() => {
      this.obraForm.get('fecha_termino_estimada')?.updateValueAndValidity();
    });
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Es opcional
    }

    const fechaInicio = this.obraForm?.get('fecha_inicio')?.value;
    if (!fechaInicio) {
      return null;
    }

    const inicio = new Date(fechaInicio);
    const termino = new Date(control.value);

    return termino >= inicio ? null : { dateRange: true };
  }

  private loadClientesActivos(): void {
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

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obraId = parseInt(id, 10);
      this.isEditMode.set(true);
      this.loadObra(this.obraId);
    }
  }

  private loadObra(id: number): void {
    this.loading.set(true);
    this.obrasService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.obraForm.patchValue(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading obra:', error);
        this.snackBar.open('Error al cargar obra', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.obraForm.invalid) {
      this.obraForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const formValue = this.obraForm.value;

    if (this.isEditMode() && this.obraId) {
      this.obrasService.update(this.obraId, formValue as UpdateObraDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Obra actualizada correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/obras']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating obra:', error);
          this.snackBar.open('Error al actualizar obra', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
    } else {
      this.obrasService.create(formValue as CreateObraDto).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Obra creada correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/obras']);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating obra:', error);
          this.snackBar.open('Error al crear obra', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/obras']);
  }

  getErrorMessage(field: string): string {
    const control = this.obraForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('dateRange')) {
      return 'Debe ser posterior a la fecha de inicio';
    }

    return '';
  }
}

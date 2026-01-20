import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientesService, ClienteCreateRequest } from './clientes.service';
import { Cliente } from '../../core/models';
import { Loading } from '../../shared/components';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    Loading
  ],
  templateUrl: './clientes-form.html',
  styleUrl: './clientes-form.scss',
})
export class ClientesForm implements OnInit {
  private fb = inject(FormBuilder);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  clienteForm!: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  clienteId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.clienteForm = this.fb.group({
      rut: ['', [Validators.required, this.rutValidator.bind(this)]],
      razon_social: ['', [Validators.required, Validators.minLength(3)]],
      nombre_fantasia: [''],
      email: ['', [Validators.email]],
      telefono: ['', [Validators.pattern(/^[+]?[0-9]{8,15}$/)]],
      direccion: [''],
      activo: [true]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = parseInt(id, 10);
      this.isEditMode.set(true);
      this.loadCliente(this.clienteId);
    }
  }

  private loadCliente(id: number): void {
    this.loading.set(true);
    this.clientesService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.clienteForm.patchValue(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading cliente:', error);
        this.snackBar.open('Error al cargar el cliente', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
        this.router.navigate(['/clientes']);
      }
    });
  }

  /**
   * Validador personalizado para RUT chileno
   */
  private rutValidator(control: AbstractControl): ValidationErrors | null {
    const rut = control.value;
    if (!rut) return null;

    const isValid = this.clientesService.validateRut(rut);
    return isValid ? null : { invalidRut: true };
  }

  /**
   * Formatear RUT mientras el usuario escribe
   */
  onRutInput(): void {
    const rutControl = this.clienteForm.get('rut');
    if (rutControl) {
      const formatted = this.clientesService.formatRut(rutControl.value);
      rutControl.setValue(formatted, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const clienteData: ClienteCreateRequest = this.clienteForm.value;

    const request$ = this.isEditMode() && this.clienteId
      ? this.clientesService.update(this.clienteId, clienteData)
      : this.clientesService.create(clienteData);

    request$.subscribe({
      next: (response) => {
        if (response.success) {
          const message = this.isEditMode()
            ? 'Cliente actualizado correctamente'
            : 'Cliente creado correctamente';

          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
          this.router.navigate(['/clientes']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error saving cliente:', error);
        const message = error.error?.message || 'Error al guardar el cliente';
        this.snackBar.open(message, 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

  // Helpers para el template
  getErrorMessage(field: string): string {
    const control = this.clienteForm.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['invalidRut']) return 'RUT inválido';

    return 'Campo inválido';
  }
}

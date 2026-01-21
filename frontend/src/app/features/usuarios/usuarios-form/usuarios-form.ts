import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UsuariosService } from '../../../core/services/usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../../../core/models/usuario.model';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    Loading
  ],
  templateUrl: './usuarios-form.html',
  styleUrl: './usuarios-form.scss'
})
export class UsuariosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  usuarioForm: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  usuarioId: number | null = null;
  showPasswordField = signal(true);

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'usuario', label: 'Usuario' }
  ];

  constructor() {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['usuario', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.usuarioId = +id;
      this.isEditMode.set(true);
      this.showPasswordField.set(false);
      this.loadUsuario();
    }
  }

  loadUsuario(): void {
    if (!this.usuarioId) return;

    this.loading.set(true);
    this.usuariosService.getById(this.usuarioId).subscribe({
      next: (response) => {
        if (!response.success) return;
        const usuario = response.data;
        // En modo edición, la contraseña es opcional
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo
        });

        // Hacer la contraseña opcional en modo edición
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();

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

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);

    const formValue = this.usuarioForm.value;

    if (this.isEditMode() && this.usuarioId) {
      const updateDto: UpdateUsuarioDto = {
        nombre: formValue.nombre,
        email: formValue.email,
        rol: formValue.rol,
        activo: formValue.activo
      };

      // Solo incluir password si se ingresó uno nuevo
      if (formValue.password) {
        updateDto.password = formValue.password;
      }

      this.usuariosService.update(this.usuarioId, updateDto).subscribe({
        next: (response) => {
          if (!response.success) return;
          this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error updating usuario:', error);
          this.snackBar.open(
            error.error?.message || 'Error al actualizar el usuario',
            'Cerrar',
            { duration: 3000 }
          );
          this.loading.set(false);
        }
      });
    } else {
      const createDto: CreateUsuarioDto = {
        nombre: formValue.nombre,
        email: formValue.email,
        password: formValue.password,
        rol: formValue.rol,
        activo: formValue.activo
      };

      this.usuariosService.create(createDto).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error creating usuario:', error);
          this.snackBar.open(
            error.error?.message || 'Error al crear el usuario',
            'Cerrar',
            { duration: 3000 }
          );
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  getErrorMessage(field: string): string {
    const control = this.usuarioForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('email')) {
      return 'Ingrese un email válido';
    }

    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return '';
  }

  togglePasswordVisibility(): void {
    this.showPasswordField.set(!this.showPasswordField());
  }
}

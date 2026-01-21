import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto, Rol } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'usuarios';

  /**
   * Transforma el usuario del backend para agregar el campo `rol` (string)
   * basado en el primer elemento del array `roles`
   */
  private transformUsuario(usuario: any): Usuario {
    return {
      ...usuario,
      rol: usuario.roles && usuario.roles.length > 0
        ? (typeof usuario.roles[0] === 'string' ? usuario.roles[0] : usuario.roles[0].nombre)
        : undefined
    };
  }

  getAll(): Observable<ApiResponse<Usuario[]>> {
    return this.apiService.get<ApiResponse<Usuario[]>>(this.endpoint).pipe(
      map(response => ({
        ...response,
        data: response.data.map(u => this.transformUsuario(u))
      }))
    );
  }

  getById(id: number): Observable<ApiResponse<Usuario>> {
    return this.apiService.get<ApiResponse<Usuario>>(`${this.endpoint}/${id}`).pipe(
      map(response => ({
        ...response,
        data: this.transformUsuario(response.data)
      }))
    );
  }

  create(usuario: CreateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.apiService.post<ApiResponse<Usuario>>(this.endpoint, usuario).pipe(
      map(response => ({
        ...response,
        data: this.transformUsuario(response.data)
      }))
    );
  }

  update(id: number, usuario: UpdateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, usuario).pipe(
      map(response => ({
        ...response,
        data: this.transformUsuario(response.data)
      }))
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Activar/Desactivar usuario
  toggleActive(id: number, activo: boolean): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, { activo }).pipe(
      map(response => ({
        ...response,
        data: this.transformUsuario(response.data)
      }))
    );
  }

  // Cambiar contraseña usando el endpoint de actualización general
  changePassword(id: number, newPassword: string): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, { password: newPassword }).pipe(
      map(response => ({
        ...response,
        data: this.transformUsuario(response.data)
      }))
    );
  }
}

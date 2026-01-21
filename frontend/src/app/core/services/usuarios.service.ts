import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'usuarios';

  getAll(): Observable<ApiResponse<Usuario[]>> {
    return this.apiService.get<ApiResponse<Usuario[]>>(this.endpoint);
  }

  getById(id: number): Observable<ApiResponse<Usuario>> {
    return this.apiService.get<ApiResponse<Usuario>>(`${this.endpoint}/${id}`);
  }

  create(usuario: CreateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.apiService.post<ApiResponse<Usuario>>(this.endpoint, usuario);
  }

  update(id: number, usuario: UpdateUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, usuario);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Activar/Desactivar usuario
  toggleActive(id: number, activo: boolean): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, { activo });
  }

  // Cambiar contraseña usando el endpoint de actualización general
  changePassword(id: number, newPassword: string): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<ApiResponse<Usuario>>(`${this.endpoint}/${id}`, { password: newPassword });
  }
}

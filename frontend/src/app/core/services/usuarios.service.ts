import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'usuarios';

  getAll(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(this.endpoint);
  }

  getById(id: number): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  create(usuario: CreateUsuarioDto): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  update(id: number, usuario: UpdateUsuarioDto): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Activar/Desactivar usuario
  toggleActive(id: number, activo: boolean): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, { activo });
  }

  // Cambiar contraseña
  changePassword(id: number, newPassword: string): Observable<void> {
    return this.apiService.put<void>(`${this.endpoint}/${id}/password`, { password: newPassword });
  }
}

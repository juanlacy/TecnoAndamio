import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Equipo, CreateEquipoDto, UpdateEquipoDto, CategoriaEquipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private apiService = inject(ApiService);
  private readonly baseUrl = '/equipos';

  /**
   * Obtener todos los equipos
   */
  getAll(): Observable<ApiResponse<Equipo[]>> {
    return this.apiService.get<Equipo[]>(this.baseUrl);
  }

  /**
   * Obtener equipo por ID
   */
  getById(id: number): Observable<ApiResponse<Equipo>> {
    return this.apiService.get<Equipo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear nuevo equipo
   */
  create(equipo: CreateEquipoDto): Observable<ApiResponse<Equipo>> {
    return this.apiService.post<Equipo>(this.baseUrl, equipo);
  }

  /**
   * Actualizar equipo
   */
  update(id: number, equipo: UpdateEquipoDto): Observable<ApiResponse<Equipo>> {
    return this.apiService.put<Equipo>(`${this.baseUrl}/${id}`, equipo);
  }

  /**
   * Eliminar equipo (soft delete)
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener componentes de un equipo
   */
  getComponentes(equipoId: number): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`${this.baseUrl}/${equipoId}/componentes`);
  }
}

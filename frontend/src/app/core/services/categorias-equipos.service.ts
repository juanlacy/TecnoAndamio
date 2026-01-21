import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CategoriaEquipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasEquiposService {
  private apiService = inject(ApiService);
  private readonly baseUrl = '/categorias-equipos';

  /**
   * Obtener todas las categorías activas
   */
  getAll(): Observable<ApiResponse<CategoriaEquipo[]>> {
    return this.apiService.get<ApiResponse<CategoriaEquipo[]>>(this.baseUrl);
  }

  /**
   * Obtener categoría por ID
   */
  getById(id: number): Observable<ApiResponse<CategoriaEquipo>> {
    return this.apiService.get<ApiResponse<CategoriaEquipo>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear nueva categoría
   */
  create(categoria: Partial<CategoriaEquipo>): Observable<ApiResponse<CategoriaEquipo>> {
    return this.apiService.post<ApiResponse<CategoriaEquipo>>(this.baseUrl, categoria);
  }

  /**
   * Actualizar categoría
   */
  update(id: number, categoria: Partial<CategoriaEquipo>): Observable<ApiResponse<CategoriaEquipo>> {
    return this.apiService.put<ApiResponse<CategoriaEquipo>>(`${this.baseUrl}/${id}`, categoria);
  }

  /**
   * Eliminar categoría
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

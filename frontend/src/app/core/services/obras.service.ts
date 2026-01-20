import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Obra, CreateObraDto, UpdateObraDto } from '../models/obra.model';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/obras';

  /**
   * Obtener todas las obras (con filtros opcionales)
   */
  getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    cliente_id?: number;
    estado?: string;
  }): Observable<ApiResponse<Obra[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.cliente_id) queryParams.append('cliente_id', params.cliente_id.toString());
    if (params?.estado) queryParams.append('estado', params.estado);

    const url = queryParams.toString()
      ? `${this.endpoint}?${queryParams.toString()}`
      : this.endpoint;

    return this.apiService.get<ApiResponse<Obra[]>>(url);
  }

  /**
   * Obtener una obra por ID
   */
  getById(id: number): Observable<ApiResponse<Obra>> {
    return this.apiService.get<ApiResponse<Obra>>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear una nueva obra
   */
  create(obra: CreateObraDto): Observable<ApiResponse<Obra>> {
    return this.apiService.post<ApiResponse<Obra>>(this.endpoint, obra);
  }

  /**
   * Actualizar una obra existente
   */
  update(id: number, obra: UpdateObraDto): Observable<ApiResponse<Obra>> {
    return this.apiService.put<ApiResponse<Obra>>(`${this.endpoint}/${id}`, obra);
  }

  /**
   * Eliminar una obra
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }
}

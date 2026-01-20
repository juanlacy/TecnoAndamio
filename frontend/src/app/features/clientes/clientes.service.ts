import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Cliente } from '../../core/models';
import { ApiResponse, PaginatedResponse } from '../../core/models';

export interface ClienteCreateRequest {
  rut: string;
  razon_social: string;
  nombre_fantasia?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}

export interface ClienteUpdateRequest extends ClienteCreateRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/clientes';

  /**
   * Obtener todos los clientes (con paginación opcional)
   */
  getAll(params?: { page?: number; limit?: number; search?: string }): Observable<ApiResponse<Cliente[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = queryParams.toString()
      ? `${this.endpoint}?${queryParams.toString()}`
      : this.endpoint;

    return this.apiService.get<ApiResponse<Cliente[]>>(url);
  }

  /**
   * Obtener un cliente por ID
   */
  getById(id: number): Observable<ApiResponse<Cliente>> {
    return this.apiService.get<ApiResponse<Cliente>>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo cliente
   */
  create(cliente: ClienteCreateRequest): Observable<ApiResponse<Cliente>> {
    return this.apiService.post<ApiResponse<Cliente>>(this.endpoint, cliente);
  }

  /**
   * Actualizar un cliente existente
   */
  update(id: number, cliente: ClienteCreateRequest): Observable<ApiResponse<Cliente>> {
    return this.apiService.put<ApiResponse<Cliente>>(`${this.endpoint}/${id}`, cliente);
  }

  /**
   * Eliminar un cliente
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  /**
   * Validar RUT chileno
   */
  validateRut(rut: string): boolean {
    // Limpiar el RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '');

    if (cleanRut.length < 2) return false;

    // Separar cuerpo y dígito verificador
    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();

    // Calcular dígito verificador esperado
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedVerifier = 11 - (sum % 11);
    let calculatedVerifier: string;

    if (expectedVerifier === 11) {
      calculatedVerifier = '0';
    } else if (expectedVerifier === 10) {
      calculatedVerifier = 'K';
    } else {
      calculatedVerifier = expectedVerifier.toString();
    }

    return verifier === calculatedVerifier;
  }

  /**
   * Formatear RUT (agregar puntos y guión)
   */
  formatRut(rut: string): string {
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    if (cleanRut.length < 2) return rut;

    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();

    // Agregar puntos cada 3 dígitos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedBody}-${verifier}`;
  }
}

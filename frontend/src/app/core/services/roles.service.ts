import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Rol } from '../models/rol.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'roles';

  getAll(): Observable<ApiResponse<{ roles: Rol[] }>> {
    return this.apiService.get<ApiResponse<{ roles: Rol[] }>>(this.endpoint);
  }

  getById(id: number): Observable<ApiResponse<{ rol: Rol }>> {
    return this.apiService.get<ApiResponse<{ rol: Rol }>>(`${this.endpoint}/${id}`);
  }
}

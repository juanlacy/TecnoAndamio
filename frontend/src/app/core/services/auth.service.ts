import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse, Usuario, AuthUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  // Signals for reactive state
  currentUser = signal<Usuario | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getUser();

    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      tap(response => {
        if (response.success) {
          this.storageService.setToken(response.data.token);
          this.storageService.setUser(response.data.usuario);
          this.currentUser.set(response.data.usuario);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout(): void {
    this.apiService.post('/auth/logout', {}).subscribe({
      complete: () => {
        this.clearSession();
      },
      error: () => {
        // Clear session even if API call fails
        this.clearSession();
      }
    });
  }

  private clearSession(): void {
    this.storageService.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUser();
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    // Soporte para roles como array de objetos o strings
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some(role => {
        const rName = typeof role === 'string' ? role : role.nombre;
        return rName.toLowerCase() === roleName.toLowerCase();
      });
    }

    // Soporte legacy para rol como string
    if (user.rol) {
      return user.rol.toLowerCase() === roleName.toLowerCase();
    }

    return false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  refreshToken(): Observable<any> {
    return this.apiService.post('/auth/refresh', {}).pipe(
      tap((response: any) => {
        if (response.success && response.data.token) {
          this.storageService.setToken(response.data.token);
        }
      })
    );
  }
}

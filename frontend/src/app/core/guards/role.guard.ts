import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const user = authService.getCurrentUser();
    if (!user || !user.roles) {
      router.navigate(['/']);
      return false;
    }

    const hasRole = user.roles.some(role => allowedRoles.includes(role.nombre));
    if (hasRole) {
      return true;
    }

    // User doesn't have required role
    router.navigate(['/']);
    return false;
  };
};

// Convenience guard for admin-only routes
export const adminGuard: CanActivateFn = roleGuard(['Admin']);

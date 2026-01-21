import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];  // Optional: roles that can see this item
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/clientes'
    },
    {
      label: 'Obras',
      icon: 'construction',
      route: '/obras'
    },
    {
      label: 'Equipos',
      icon: 'inventory_2',
      route: '/equipos'
    },
    {
      label: 'Estados de Pago',
      icon: 'description',
      route: '/edp'
    },
    {
      label: 'Usuarios',
      icon: 'admin_panel_settings',
      route: '/usuarios',
      roles: ['Admin', 'admin']  // Visible to Admin (supports both formats)
    }
  ];

  canSeeItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      return false;
    }

    // Check roles array (backend devuelve roles como array de objetos o strings)
    if (user.roles && Array.isArray(user.roles)) {
      return item.roles.some(menuRole =>
        user.roles!.some(userRole => {
          const roleName = typeof userRole === 'string' ? userRole : userRole.nombre;
          return roleName.toLowerCase() === menuRole.toLowerCase();
        })
      );
    }

    // Fallback: check rol string (legacy support)
    if (user.rol) {
      return item.roles.some(role =>
        role.toLowerCase() === user.rol!.toLowerCase()
      );
    }

    return false;
  }
}

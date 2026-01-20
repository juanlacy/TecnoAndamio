import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes-list').then(m => m.ClientesList)
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () => import('./features/clientes/clientes-form').then(m => m.ClientesForm)
      },
      {
        path: 'clientes/editar/:id',
        loadComponent: () => import('./features/clientes/clientes-form').then(m => m.ClientesForm)
      },
      {
        path: 'clientes/ver/:id',
        loadComponent: () => import('./features/clientes/clientes-detail').then(m => m.ClientesDetail)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/usuarios-list/usuarios-list').then(m => m.UsuariosListComponent)
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () => import('./features/usuarios/usuarios-form/usuarios-form').then(m => m.UsuariosFormComponent)
      },
      {
        path: 'usuarios/:id',
        loadComponent: () => import('./features/usuarios/usuarios-detail/usuarios-detail').then(m => m.UsuariosDetailComponent)
      },
      {
        path: 'usuarios/:id/editar',
        loadComponent: () => import('./features/usuarios/usuarios-form/usuarios-form').then(m => m.UsuariosFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

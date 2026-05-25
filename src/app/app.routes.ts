import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { userGuard } from './core/guards/user-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./shared/components/layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./features/admin/items/items.component').then((m) => m.ItemsComponent),
      }
    ],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    loadComponent: () => import('./shared/components/layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/user/dashboard/dashboard').then((m) => m.Dashboard),
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

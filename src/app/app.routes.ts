import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin-guard';
import { userGuard } from '@core/guards/user-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('@shared/components/layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('@features/admin/items/item-list/items.component').then((m) => m.ItemsComponent),
      },
      {
        path: 'items/crear',
        loadComponent: () =>
          import('@features/admin/items/item-create/item-create.component').then((m) => m.ItemCreateComponent),
      },
      {
        path: 'items/editar/:id',
        loadComponent: () =>
          import('@features/admin/items/item-edit/item-edit.component').then((m) => m.ItemEditComponent),
      }
    ],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    loadComponent: () => import('@shared/components/layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@features/user/dashboard/dashboard').then((m) => m.Dashboard),
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

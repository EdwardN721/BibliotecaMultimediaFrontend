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
        loadChildren: () => import('@features/admin/items/routes/items.routes')
          .then((m) => m.ITEMS_ROUTES)
      },
      {
        path: 'catalogos',
        loadChildren: () => import('@features/admin/catalogos/creadores/routes/creadores.routes')
          .then((m) => m.CREADORES_ROUTES)
      },
      {
        path: 'catalogos',
        loadChildren: () => import('@features/admin/catalogos/plataformas/routes/plataformas.routes')
          .then((m) => m.PLATAFORMAS_ROUTES)
      },
      {
        path: 'catalogos',
        loadChildren: () => import('@features/admin/catalogos/formatos/routes/formatos.rotes')
          .then((m) => m.FORMATOS_ROUTES)
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

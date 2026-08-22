import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin-guard';
import { userGuard } from '@core/guards/user-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('@features/auth/registro/registro').then((m) => m.Registro),
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
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'creadores',
          },
          {
            path: 'creadores',
            loadChildren: () => import('@features/admin/catalogos/creadores/routes/creadores.routes')
              .then((m) => m.CREADORES_ROUTES)
          },
          {
            path: 'plataformas',
            loadChildren: () => import('@features/admin/catalogos/plataformas/routes/plataformas.routes')
              .then((m) => m.PLATAFORMAS_ROUTES)
          },
          {
            path: 'formatos',
            loadChildren: () => import('@features/admin/catalogos/formatos/routes/formatos.routes')
              .then((m) => m.FORMATOS_ROUTES)
          },
          {
            path: 'generos',
            loadChildren: () => import('@features/admin/catalogos/generos/routes/genero.routes')
              .then((m) => m.GENERO_ROUTES)
          },
          {
            path: 'tipo-medios',
            loadChildren: () => import('@features/admin/catalogos/tipo-medios/routes/tipo-medio.routes')
              .then((m) => m.TIPO_MEDIO_ROUTES)
          }
        ]
      }
    ],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    loadComponent: () =>
      import('@shared/components/user-layout/user-layout').then((m) => m.UserLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@features/user/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'explorar',
        loadComponent: () => import('@features/user/explorar/explorar').then((m) => m.Explorar),
      },
      {
        path: 'titulo/:id',
        loadComponent: () =>
          import('@features/user/detalle-titulo/detalle-titulo').then((m) => m.DetalleTitulo),
      },
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

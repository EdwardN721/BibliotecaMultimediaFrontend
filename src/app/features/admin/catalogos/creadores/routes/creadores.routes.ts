export const CREADORES_ROUTES = [
  {
    path: 'creadores',
    loadComponent: () =>
      import('@features/admin/catalogos/creadores/creadores-list/creadores-list.component').then(
        (m) => m.CreadoresListComponent,
      ),
  },
  {
    path: 'creadores/nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/creadores/creadores-nuevo/creadores-nuevo.component').then(
        (m) => m.CreadoresNuevoComponent,
      ),
  },
  {
    path: 'creadores/editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/creadores/creadores-editar/creadores-editar.component').then(
        (m) => m.CreadoresEditarComponent,
      ),
  },
];

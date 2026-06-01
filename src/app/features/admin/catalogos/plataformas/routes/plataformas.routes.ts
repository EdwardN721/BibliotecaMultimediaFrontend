export const PLATAFORMAS_ROUTES = [
  {
    path: 'plataformas',
    loadComponent: () =>
      import('@features/admin/catalogos/plataformas/plataforma-lista/plataformas.component').then(
        (m) => m.PlataformasComponent,
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
    path: 'creadores/editar/:id', // Todavia no creado
    loadComponent: () =>
      import('@features/admin/catalogos/creadores/creadores-editar/creadores-editar.component').then(
        (m) => m.CreadoresEditarComponent,
      ),
  },
];

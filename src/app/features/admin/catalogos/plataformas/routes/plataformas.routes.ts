export const PLATAFORMAS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/catalogos/plataformas/plataforma-lista/plataformas.component').then(
        (m) => m.PlataformasComponent,
      ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/plataformas/plataforma-nuevo/plataforma-nuevo.component').then(
        (m) => m.PlataformaNuevoComponent,
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/plataformas/plataforma-editar/plataforma-editar.component').then(
        (m) => m.PlataformaEditarComponent,
      ),
  },
];
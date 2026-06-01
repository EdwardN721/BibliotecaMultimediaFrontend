export const GENERO_ROUTES = [
  {
    path: 'generos',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-lista/genero-lista.component').then(
        (m) => m.GeneroListaComponent,
      ),
  },
  {
    path: 'generos/nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-nuevo/genero-nuevo.component').then(
        (m) => m.GeneroNuevoComponent,
      ),
  },
  {
    path: 'generos/editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-editar/genero-editar.component').then(
        (m) => m.GeneroEditarComponent,
      ),
  },
];

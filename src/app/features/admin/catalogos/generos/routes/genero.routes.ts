export const GENERO_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-lista/genero-lista.component').then(
        (m) => m.GeneroListaComponent,
      ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-nuevo/genero-nuevo.component').then(
        (m) => m.GeneroNuevoComponent,
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/generos/genero-editar/genero-editar.component').then(
        (m) => m.GeneroEditarComponent,
      ),
  },
];
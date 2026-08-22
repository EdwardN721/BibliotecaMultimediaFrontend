export const FORMATOS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-lista/formato-lista.component').then(
    (m) => m.FormatoListaComponent,
    ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-nuevo/formato-nuevo.component').then(
    (m) => m.FormatoNuevoComponent,
    ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-editar/formato-editar.component').then(
    (m) => m.FormatoEditarComponent,
    ),
  },
]
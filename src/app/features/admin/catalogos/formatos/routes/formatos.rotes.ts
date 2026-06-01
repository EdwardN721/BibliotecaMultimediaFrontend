export const FORMATOS_ROUTES = [
  {
    path: 'formatos',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-lista/formato-lista.component').then(
    (m) => m.FormatoListaComponent,
    ),
  },
  {
    path: 'formatos/nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-nuevo/formato-nuevo.component').then(
    (m) => m.FormatoNuevoComponent,
    ),
  },
  {
    path: 'formatos/editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/formatos/formato-editar/formato-editar.component').then(
    (m) => m.FormatoEditarComponent,
    ),
  },
]

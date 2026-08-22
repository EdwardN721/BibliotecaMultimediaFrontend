export const TIPO_MEDIO_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medios/tipo-medio-lista/tipo-medio-lista.component').then(
    (m) => m.TipoMedioListaComponent,
    ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medios/tipo-medio-nuevo/tipo-medio-nuevo.component').then(
    (m) => m.TipoMedioNuevoComponent,
    ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medios/tipo-medio-editar/tipo-medio-editar.component').then(
    (m) => m.TipoMedioEditarComponent,
    ),
  },
]
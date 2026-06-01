export const TIPO_MEDIO_ROUTES = [
  {
    path: 'tipo-medios',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medio/tipo-medio-lista/tipo-medio-lista.component').then(
    (m) => m.TipoMedioListaComponent,
    ),
  },
  {
    path: 'tipo-medios/nuevo',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medio/tipo-medio-nuevo/tipo-medio-nuevo.component').then(
    (m) => m.TipoMedioNuevoComponent,
    ),
  },
  {
    path: 'tipo-medios/editar/:id',
    loadComponent: () =>
      import('@features/admin/catalogos/tipo-medio/tipo-medio-editar/tipo-medio-editar.component').then(
    (m) => m.TipoMedioEditarComponent,
    ),
  },
]

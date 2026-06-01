export const ITEMS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('@features/admin/items/item-list/items.component').then((m) => m.ItemsComponent),
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('@features/admin/items/item-create/item-create.component').then(
        (m) => m.ItemCreateComponent,
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('@features/admin/items/item-edit/item-edit.component').then(
        (m) => m.ItemEditComponent,
      ),
  },
];

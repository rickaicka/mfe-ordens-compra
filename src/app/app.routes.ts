import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.page').then((m) => m.UnauthorizedPage),
  },
  { path: '', loadChildren: () => import('./remote-entry/entry.routes').then((m) => m.ORDENS_COMPRA_ROUTES) },
  { path: '**', redirectTo: '' },
];

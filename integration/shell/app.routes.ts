import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { hubAuthGuard } from '@daruix/hub-auth';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        ({ LoginComponent }) => LoginComponent,
      ),
  },
  {
    path: 'hub',
    canActivate: [hubAuthGuard],
    loadComponent: () =>
      import('./core/layout/hub-layout/hub-layout.component').then(
        ({ HubLayoutComponent }) => HubLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',

        loadComponent: () =>
          import('./pages/hub-dashboard/hub-dashboard.component').then(
            ({ HubDashboardComponent }) => HubDashboardComponent,
          ),
      },
      {
        path: 'remessas',
        loadChildren: () =>
          loadRemoteModule('remessas', './Routes').then(
            (m) => m.REMESSAS_ROUTES,
          ),
      },
      {
        path: 'ordens-compra',
        loadChildren: () =>
          loadRemoteModule('ordens-compra', './Routes').then(
            (m) => m.ORDENS_COMPRA_ROUTES,
          ),
      },
      {
        path: 'obras',
        loadChildren: () =>
          loadRemoteModule('obras', './Routes').then(
            (m) => m.OBRAS_ROUTES,
          ),
      },
      {
        path: 'gestao-administrativa',
        loadChildren: () =>
          loadRemoteModule('gestao-administrativa', './Routes').then(
            (m) => m.CADASTROS_ROUTES,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hub',
  },
  {
    path: '**',
    redirectTo: 'hub',
  },
];

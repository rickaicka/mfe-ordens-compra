import { provideHttpClient, withFetch } from '@angular/common/http';
import { Routes } from '@angular/router';
import { hubPermissionGuard } from '@daruix/hub-auth';
import { OpenedBuyOrderService } from '../opened-buy-order.service';

export const ORDENS_COMPRA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lista' },
  {
    path: 'lista',
    canActivate: [hubPermissionGuard],
    data: { permission: 'po.ver' },
    // A API Flask original usa um cliente HTTP próprio, sem os interceptors do BFF.
    providers: [provideHttpClient(withFetch()), OpenedBuyOrderService],
    loadComponent: () => import('../features/ordens-compra/ordens-compra.page').then((m) => m.OrdensCompraPage),
  },
];

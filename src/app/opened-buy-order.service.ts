import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export const ORDENS_COMPRA_API_URL = new InjectionToken<string>('ORDENS_COMPRA_API_URL', {
  providedIn: 'root',
  factory: () => environment.ordersApiUrl,
});

@Injectable({ providedIn: 'root' })
export class OpenedBuyOrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = inject(ORDENS_COMPRA_API_URL).replace(/\/+$/, '');

  // O ZIP original não contém o contrato da resposta da API.
  getOpenedBuyOrders(): Observable<unknown> {
    return this.httpClient.get<unknown>(`${this.apiUrl}/opened-buy-order`);
  }
}

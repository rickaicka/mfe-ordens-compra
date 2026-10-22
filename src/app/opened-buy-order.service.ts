import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OpenedBuyOrderRaw, OrdersApiResponse } from './models/opened-buy-order.model';

export const ORDENS_COMPRA_API_URL = new InjectionToken<string>('ORDENS_COMPRA_API_URL', {
  providedIn: 'root', factory: () => environment.ordersApiUrl,
});

@Injectable({ providedIn: 'root' })
export class OpenedBuyOrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = inject(ORDENS_COMPRA_API_URL).replace(/\/+$/, '');

  getOpenedBuyOrders(): Observable<OpenedBuyOrderRaw[]> {
    return this.httpClient.get<OrdersApiResponse | OpenedBuyOrderRaw[]>(`${this.apiUrl}/opened-buy-order`).pipe(
      map((response) => {
        if (Array.isArray(response)) return response;
        if (response.status === 'error') throw new Error(response.message || 'Não foi possível consultar as ordens.');
        if (!Array.isArray(response.data)) throw new Error('Resposta inválida da API de ordens de compra.');
        return response.data;
      }),
    );
  }

  getOCPDF(pcNumber: string, code: string): Observable<Blob> {
    const pc = encodeURIComponent(pcNumber);
    const oc = encodeURIComponent(code);
    return this.httpClient.get(`${this.apiUrl}/pdf/${pc}/${oc}`, { responseType: 'blob' });
  }
}

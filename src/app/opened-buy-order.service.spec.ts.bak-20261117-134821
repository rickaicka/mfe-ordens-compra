import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OpenedBuyOrderService, ORDENS_COMPRA_API_URL } from './opened-buy-order.service';

describe('OpenedBuyOrderService', () => {
  let service: OpenedBuyOrderService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: ORDENS_COMPRA_API_URL, useValue: '/ordens-compra-api/' }] });
    service = TestBed.inject(OpenedBuyOrderService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('usa a URL configurada e preserva o endpoint Flask', () => {
    let result: unknown;
    service.getOpenedBuyOrders().subscribe((value) => result = value);
    const request = http.expectOne('/ordens-compra-api/opened-buy-order');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1 }]);
    expect(result).toEqual([{ id: 1 }]);
  });
  it('desembrulha data da resposta Flask', () => {
    let result: unknown;
    service.getOpenedBuyOrders().subscribe(value => result = value);
    http.expectOne('/ordens-compra-api/opened-buy-order').flush({ status: 'success', data: [{ pc_number: '123', cod: '456' }], pagination: { total: 1, page: 1, per_page: 100 } });
    expect(result).toEqual([{ pc_number: '123', cod: '456' }]);
  });
  it('reporta erro declarado pela API', () => {
    let error: Error | undefined;
    service.getOpenedBuyOrders().subscribe({ error: value => error = value });
    http.expectOne('/ordens-compra-api/opened-buy-order').flush({ status: 'error', message: 'Falha no banco', data: [] });
    expect(error?.message).toBe('Falha no banco');
  });
  it('solicita PDF como blob e codifica os identificadores', () => {
    service.getOCPDF('PC 123', 'A/45').subscribe();
    const request = http.expectOne('/ordens-compra-api/pdf/PC%20123/A%2F45');
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['%PDF-1.4']));
  });

});

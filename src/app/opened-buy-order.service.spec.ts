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
});

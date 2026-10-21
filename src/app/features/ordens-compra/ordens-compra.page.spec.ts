import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenedBuyOrderService } from '../../opened-buy-order.service';
import { OrdensCompraPage } from './ordens-compra.page';

describe('OrdensCompraPage', () => {
  let getOrders: ReturnType<typeof vi.fn>;
  beforeEach(async () => {
    getOrders = vi.fn(() => of([]));
    await TestBed.configureTestingModule({ imports: [OrdensCompraPage],
      providers: [{ provide: OpenedBuyOrderService, useValue: { getOpenedBuyOrders: getOrders } }] }).compileComponents();
  });
  it('conclui a consulta inicial', () => {
    const c = TestBed.createComponent(OrdensCompraPage).componentInstance;
    expect(c.loaded()).toBe(true);
    expect(c.loading()).toBe(false);
    expect(getOrders).toHaveBeenCalledOnce();
  });
  it('permite tentar novamente após erro', () => {
    getOrders.mockReturnValueOnce(throwError(() => new Error('API indisponível')));
    const c = TestBed.createComponent(OrdensCompraPage).componentInstance;
    expect(c.error()).toBe(true);
    c.atualizar();
    expect(c.loaded()).toBe(true);
    expect(c.error()).toBe(false);
  });
  it('evita consultas simultâneas e cancela ao destruir a tela', () => {
    const pending = new Subject<unknown>();
    getOrders.mockReturnValue(pending);
    const fixture = TestBed.createComponent(OrdensCompraPage);
    fixture.componentInstance.atualizar();
    expect(getOrders).toHaveBeenCalledOnce();
    expect(pending.observed).toBe(true);
    fixture.destroy();
    expect(pending.observed).toBe(false);
  });
});

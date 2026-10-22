import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OpenedBuyOrderRaw } from '../../models/opened-buy-order.model';
import { OpenedBuyOrderService } from '../../opened-buy-order.service';
import { OrdensCompraPage } from './ordens-compra.page';

const order = (pc: string, code: number, date = '21/10/2026'): OpenedBuyOrderRaw => ({
  pc_number: pc,
  cod: code,
  dt_solicitation: '20/10/2026',
  dt_delivery: date,
  buy_order_value: 1400,
  supplier: 'Fornecedor',
  description: 'Materiais',
  status: '0;Em Andamento',
});

describe('OrdensCompraPage', () => {
  let getOrders: ReturnType<typeof vi.fn>;
  let getPDF: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getOrders = vi.fn(() => of([]));
    getPDF = vi.fn();

    await TestBed.configureTestingModule({
      imports: [OrdensCompraPage],
      providers: [
        {
          provide: OpenedBuyOrderService,
          useValue: {
            getOpenedBuyOrders: getOrders,
            getOCPDF: getPDF,
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => vi.restoreAllMocks());

  it('carrega a tela mobile vazia e consulta a API uma única vez', async () => {
    const fixture = TestBed.createComponent(OrdensCompraPage);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.loaded()).toBe(true);
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Nenhuma ordem de compra encontrada');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeNull();
    expect(getOrders).toHaveBeenCalledOnce();
  });

  it('exibe erro e permite tentar novamente', () => {
    getOrders.mockReturnValueOnce(throwError(() => new Error('API indisponível')));

    const fixture = TestBed.createComponent(OrdensCompraPage);
    const component = fixture.componentInstance;

    expect(component.error()).toContain('Não foi possível');
    expect(component.loaded()).toBe(true);

    component.atualizar();

    expect(component.error()).toBe('');
    expect(component.loaded()).toBe(true);
    expect(getOrders).toHaveBeenCalledTimes(2);
  });

  it('evita consultas simultâneas e cancela a assinatura ao destruir a tela', () => {
    const pending = new Subject<OpenedBuyOrderRaw[]>();
    getOrders.mockReturnValue(pending);

    const fixture = TestBed.createComponent(OrdensCompraPage);

    fixture.componentInstance.atualizar();

    expect(getOrders).toHaveBeenCalledOnce();
    expect(pending.observed).toBe(true);

    fixture.destroy();

    expect(pending.observed).toBe(false);
  });

  it('filtra por PC e restaura a lista completa ao limpar', () => {
    getOrders.mockReturnValue(of([order('123', 1), order('456', 2)]));

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;

    component.handleChangeType(
      new CustomEvent('ionChange', { detail: { value: 'type_pc' } }),
    );
    component.handleChange(
      new CustomEvent('ionChange', { detail: { value: 'PC 123' } }),
    );

    expect(component.openedOrders().map((item) => item.cod)).toEqual(['1']);
    expect(component.selectedFilterValue()).toBe('PC 123');
    expect(component.hasActiveFilter()).toBe(true);

    component.clearFilters();

    expect(component.openedOrders()).toHaveLength(2);
    expect(component.filterType()).toBe('');
    expect(component.hasActiveFilter()).toBe(false);
  });

  it('filtra por entrega, ordena as datas e mantém o filtro após atualizar', () => {
    getOrders.mockReturnValue(
      of([
        order('123', 1, '22/10/2026'),
        order('456', 2, '21/10/2026'),
      ]),
    );

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;

    component.handleChangeType(
      new CustomEvent('ionChange', { detail: { value: 'type_date' } }),
    );
    component.handleChange(
      new CustomEvent('ionChange', { detail: { value: '22/10/2026' } }),
    );

    component.atualizar();

    expect(component.openedOrders().map((item) => item.cod)).toEqual(['1']);
    expect(component.dateList()).toEqual(['21/10/2026', '22/10/2026']);
    expect(component.activeFilterOptions()).toEqual(component.dateList());
  });

  it('renderiza somente a estrutura mobile com cards Ionic', async () => {
    getOrders.mockReturnValue(
      of([
        {
          ...order('123', 1),
          description: 'Descrição longa de materiais para o centro de custo',
        },
      ]),
    );

    const fixture = TestBed.createComponent(OrdensCompraPage);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('ion-accordion')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('ion-card')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      'Descrição longa de materiais para o centro de custo',
    );
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('abre o filtro correto e limpa o valor ao trocar o tipo', () => {
    getOrders.mockReturnValue(of([order('123', 1)]));

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;

    component.handleChangeType(
      new CustomEvent('ionChange', { detail: { value: 'type_pc' } }),
    );
    component.handleChange(
      new CustomEvent('ionChange', { detail: { value: '123' } }),
    );

    expect(component.selectedFilterValue()).toBe('123');

    component.handleChangeType(
      new CustomEvent('ionChange', { detail: { value: 'type_date' } }),
    );

    expect(component.formPC.controls.pc_number.value).toBe('');
    expect(component.formPC.controls.dt_delivery.value).toBe('');
    expect(component.selectedFilterValue()).toBe('');
  });

  it('fecha a janela e informa quando o PDF não existe', () => {
    const close = vi.fn();
    vi.spyOn(window, 'open').mockReturnValue({ close } as unknown as Window);
    getPDF.mockReturnValue(throwError(() => ({ status: 404 })));
    getOrders.mockReturnValue(of([order('123', 1)]));

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;
    const selectedOrder = component.openedOrders()[0];

    component.downloadOC(selectedOrder);

    expect(getPDF).toHaveBeenCalledWith('123', '1');
    expect(close).toHaveBeenCalledOnce();
    expect(component.pdfError()).toBe('PDF não encontrado.');
    expect(component.downloading()).toBeNull();
    expect(component.isDownloading(selectedOrder)).toBe(false);
  });

  it('rejeita HTML recebido como se fosse PDF', async () => {
    const close = vi.fn();
    vi.spyOn(window, 'open').mockReturnValue({ close } as unknown as Window);
    getPDF.mockReturnValue(of(new Blob(['<html>Erro</html>'])));
    getOrders.mockReturnValue(of([order('123', 1)]));

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;

    component.downloadOC(component.openedOrders()[0]);

    await vi.waitFor(() => expect(component.pdfError()).toContain('PDF válido'));
    expect(close).toHaveBeenCalledOnce();
  });

  it('limpa o erro do PDF sem alterar os demais dados', () => {
    getOrders.mockReturnValue(of([order('123', 1)]));

    const component = TestBed.createComponent(OrdensCompraPage).componentInstance;

    component.pdfError.set('PDF não encontrado.');
    component.clearPdfError();

    expect(component.pdfError()).toBe('');
    expect(component.openedOrders()).toHaveLength(1);
  });
});

import { describe, expect, it } from 'vitest';
import { normalizeOrder, OpenedBuyOrderRaw } from './opened-buy-order.model';
const raw: OpenedBuyOrderRaw = { pc_number: 12, cod: 34, dt_delivery: null, dt_solicitation: null, buy_order_value: null, supplier: null, description: null, status: null };
describe('Normalização das ordens', () => {
  it.each([['0;Outros dados', 'Em Andamento', 'status-opened'], ['1', 'Não Entregue', 'status-undelivered'], [2, 'Entregue', 'status-delivered'], [null, 'Não informado', 'status-unknown']])('normaliza status %s', (status, label, css) => {
    const result = normalizeOrder({ ...raw, status });
    expect(result.status).toBe(label); expect(result.classStatus).toBe(css);
    expect(result.pc_number).toBe('12'); expect(result.cod).toBe('34');
  });
});

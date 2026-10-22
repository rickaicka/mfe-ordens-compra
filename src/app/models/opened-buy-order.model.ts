export interface OpenedBuyOrderRaw {
  pc_number: string | number | null;
  cod: string | number | null;
  dt_solicitation: string | null;
  dt_delivery: string | null;
  buy_order_value: string | number | null;
  supplier: string | null;
  description: string | null;
  status: string | number | null;
}

export interface OpenedBuyOrder extends Omit<OpenedBuyOrderRaw, 'pc_number' | 'cod' | 'status'> {
  pc_number: string;
  cod: string;
  status: string;
  classStatus: string;
}

export interface OrdersApiResponse {
  status: 'success' | 'error';
  message: string;
  pagination?: { total: number; page: number; per_page: number };
  data: OpenedBuyOrderRaw[];
}

export function normalizeOrder(order: OpenedBuyOrderRaw): OpenedBuyOrder {
  const status = String(order.status ?? '').split(';')[0].trim();
  const states: Record<string, [string, string]> = {
    '0': ['Em Andamento', 'status-opened'],
    '1': ['Não Entregue', 'status-undelivered'],
    '2': ['Entregue', 'status-delivered'],
    'Em Andamento': ['Em Andamento', 'status-opened'],
    'Não Entregue': ['Não Entregue', 'status-undelivered'],
    'Entregue': ['Entregue', 'status-delivered'],
  };
  const [label, classStatus] = states[status] ?? [status || 'Não informado', 'status-unknown'];
  return { ...order, pc_number: String(order.pc_number ?? ''), cod: String(order.cod ?? ''), status: label, classStatus };
}

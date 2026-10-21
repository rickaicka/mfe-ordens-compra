import { describe, expect, it } from 'vitest';
import { hubPermissionGuard } from '@daruix/hub-auth';
import { ORDENS_COMPRA_ROUTES } from './entry.routes';

describe('Rotas federadas de ordens de compra', () => {
  it('direciona a raiz para a lista e exige po.ver', () => {
    expect(ORDENS_COMPRA_ROUTES[0].redirectTo).toBe('lista');
    const list = ORDENS_COMPRA_ROUTES.find((route) => route.path === 'lista');
    expect(list?.data?.['permission']).toBe('po.ver');
    expect(list?.canActivate).toContain(hubPermissionGuard);
  });
});

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ordens-compra-unauthorized',
  standalone: true,
  template: '<main><h1>Acesso não autorizado</h1><p>Acesse pelo Daruix Hub com um usuário que tenha permissão para visualizar ordens de compra.</p></main>',
  styles: ['main { max-width: 720px; margin: auto; padding: 24px; font-family: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPage {}

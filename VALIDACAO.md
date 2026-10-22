# Validação — 21/10/2026

- Dependências instaladas e package-lock.json atualizado, mantendo Angular 21.2.20, Native Federation 21.2.5 e hub-auth 0.0.17. Material/CDK 21.2.14 e Ionic 8.8.14 adicionados para a tela recebida.
- Build de produção com a exposição federada ./Routes e remote ordens-compra.
- 18 testes automatizados: resposta Flask envelopada, array direto, erro da API, endpoint PDF com identificadores codificados, normalização de status, erro/reconsulta, cancelamento ao destruir, troca de filtro sem perder a lista original, manutenção de filtro após atualizar, cartões mobile, PDF inexistente e rejeição de HTML no lugar de PDF.
- Conferência em Chromium com dados simulados: tabela/paginação/filtro no desktop (1280px), cartões em 390px e 320px e seletor de PC no mobile. Sem transbordamento horizontal da página; a tabela conserva sua própria rolagem.
- Os dados simulados e os scripts de inspeção não fazem parte do aplicativo entregue.

Não executados: Docker build, deploy na VPS, consulta à API Flask real, login real e carregamento pelo Shell real. A verificação no navegador usa o bootstrap isolado do MFE com uma sessão local de teste. A disponibilidade do backend e a configuração real do proxy precisam ser verificadas no ambiente publicado.

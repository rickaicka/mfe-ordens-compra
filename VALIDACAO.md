# Validação da conversão — 21/10/2026

Executado nesta entrega:

- Instalação das dependências e geração de novo package-lock.json para Angular 21 (o lock Angular 18 do ZIP original não foi reutilizado).
- `npm run build`: passou e gerou `dist/mfe-daruix-ordens-compra/remoteEntry.json`.
- `npm run test:ci`: 4 arquivos de teste e 6 testes aprovados.
- `npm ls`: Angular core/common/router 21.2.20, Native Federation 21.2.5 e hub-auth 0.0.17.
- Leitura de remoteEntry.json: remote `ordens-compra`, exposição `./Routes`, Angular core singleton/strictVersion 21.2.20.
- Conferência de que os artefatos compartilhados e expostos existem no diretório de saída.
- Sintaxe JSON dos arquivos de configuração e sintaxe Bash dos passos run do workflow.

Não executado: Docker build, Nginx real, API Flask real, integração com o Shell em um navegador e deploy na VPS. O ambiente desta entrega não tem Docker/Nginx nem navegador Chromium instalado. Os exemplos de upstream do Flask precisam ser ajustados antes do deploy.

O projeto recebido só tinha o template Angular e um GET com console.log. A migração não equivale à implementação de uma tela de listagem, filtros e visualização de PDFs, que não vieram no ZIP original.

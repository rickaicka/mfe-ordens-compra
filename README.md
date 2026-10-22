# Ordens de Compra — tela completa no Daruix Hub

Tela portada do projeto Ionic original recebido para o MFE Angular 21.2.20 / Native Federation 21.2.5. Mantém a tabela no desktop, filtro por PC, ordenação, paginação, cartões expansíveis no celular, filtro por PC ou data de entrega e abertura do PDF. Logo, fonte Quicksand e cores de status acompanham o pacote.

## Copiar para o projeto existente

1. Extraia o ZIP e copie o conteúdo para a raiz de `mfe-daruix-ordens-compra`, mesclando as pastas e substituindo os arquivos correspondentes. `package.json`, `package-lock.json`, `angular.json`, `federation.config.js`, `vitest.config.ts`, `src/` e `public/assets/` precisam acompanhar a alteração.
2. Preserve os demais arquivos existentes no seu projeto, incluindo o workflow em `.github/workflows/`. Não é necessário apagar o projeto antes de copiar.
3. Na raiz do projeto, execute:

```bash
npm ci
npm run test:ci
npm run build
```

4. Faça commit/push para o workflow publicar a nova imagem. Se o fluxo de publicação/deploy já está funcionando, basta atualizar o serviço `ordens-compra` pelo processo atual.

O build fica em `dist/mfe-daruix-ordens-compra/`. Não copie o código-fonte para dentro do container em execução: publique a imagem ou use os estáticos compilados pelo seu processo de deploy.

## Integração mantida

- Nome do remote: `ordens-compra`; exposição: `./Routes`; export: `ORDENS_COMPRA_ROUTES`.
- Rota interna recebida: `ordens-compra`; a entrada vazia redireciona para ela. Com a montagem atual do Shell, a URL completa é `/hub/ordens-compra/ordens-compra`.
- Permissão: `po.ver`, pelo `hubPermissionGuard` do pacote compartilhado `@daruix/hub-auth` 0.0.17.
- Produção: `ordersApiUrl: '/ordens-compra-api'`. O servidor precisa continuar encaminhando `/ordens-compra-api/` para `https://api.daruix-engenharia.vps-kinghost.net/flask/`.
- Consulta: `GET /ordens-compra-api/opened-buy-order`. Aceita a resposta original `{ status, message, pagination, data: [...] }` e também um array direto.
- PDF: `GET /ordens-compra-api/pdf/{pc}/{oc}`. A resposta deve conter um PDF real. Respostas HTML e erros de consulta são exibidos na tela.
- O cliente HTTP dessa rota continua independente dos interceptors do BFF, como no projeto recebido.
- O Shell continua precisando registrar `ordens-compra` no manifest. Este pacote atualiza o MFE; não modifica automaticamente o manifest do Shell nem o Nginx da VPS.

Os filtros e a paginação funcionam sobre os registros retornados pela consulta, como na tela original. Se o Flask limitar os registros no servidor, os demais registros exigem adaptar a consulta ao contrato de paginação do backend.

## Visual e comportamento

A tabela possui rolagem horizontal própria em telas intermediárias. Abaixo de 768px, a página usa cartões Ionic com o texto completo e sem alturas fixas que cortem fornecedor ou descrição. O cabeçalho é local à página, sem posição fixa ou margens para compensar o cabeçalho antigo.

O tema Material fica limitado à página e ao painel de seleção da paginação. A fonte e o logo são carregados do próprio remote, inclusive quando o Shell carrega somente as rotas federadas. Não é necessário copiar os resets globais do app antigo para o Hub.

A consulta inicial ocorre uma vez; o botão Atualizar refaz a busca e mantém o filtro. O polling de 1,5 segundo do aplicativo antigo foi removido. PDFs abrem em nova aba; se o navegador bloquear a janela, o arquivo é baixado. Esta versão usa as APIs do navegador, sem exigir instalação de plugins Capacitor para abrir PDFs.

## Desenvolvimento

```bash
npm start
```

Remote em `http://localhost:4305/remoteEntry.json`. A rota permanece protegida; para usar com os dados e permissões reais, entre pelo Shell autenticado. Revise `src/environments/environment.ts` para a URL do Flask no seu ambiente local.

Consulte `VALIDACAO.md` para os testes executados e os limites da verificação.

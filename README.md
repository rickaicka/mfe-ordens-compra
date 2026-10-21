# MFE de Ordens de Compra — Daruix Hub

Base convertida do projeto `front-opened-order` enviado. Angular 21.2.20 e Native Federation 21.2.5, iguais às versões declaradas do Shell fornecido. Sem SSR/hydration.

## O que esta entrega contém

- Remote `ordens-compra`, exposição `./Routes`, export `ORDENS_COMPRA_ROUTES`.
- Rotas internas `/lista`; entrada no Hub `/hub/ordens-compra/lista`.
- `hubPermissionGuard` com `data.permission: 'po.ver'`.
- Inicialização da federação antes do bootstrap Angular.
- Serviço preservando `GET /opened-buy-order`, com URL configurável.
- Docker/Nginx, healthcheck, publicação GHCR e deploy do serviço `ordens-compra`.
- Exemplos de integração com o Shell e com a VPS.

**Escopo do ZIP original:** ele continha o template padrão Angular e uma consulta ao Flask que apenas imprimia a resposta no console. Não continha listagem, filtros ou abertura de PDFs. Esta entrega prepara essa base como MFE e oferece uma página mínima de consulta com carregamento, sucesso, erro e nova tentativa. Não inventa o contrato da API nem implementa uma tabela/PDF inexistente no código recebido. Para portar a tela real, use os arquivos dela e o contrato do Flask nesta estrutura.

## Executar localmente

Use Node 22.12+ ou Node 24 compatível com Angular 21. Use npm 11; o Docker fixa 11.13.0.

```bash
npm ci
npm start
```

Remote: `http://localhost:4305/remoteEntry.json`.

A rota é protegida, inclusive ao executar o remote sozinho. Sem essa permissão, a execução isolada mostra a página de acesso não autorizado. O fluxo recomendado é fazer login no Shell e abrir `/hub/ordens-compra/lista`. O `app.config.ts` do remote só participa do bootstrap isolado; quando federado, os providers de autenticação vêm do Shell.

A API Flask original é independente do BFF. O cliente HTTP da rota não utiliza os interceptors de autenticação do Shell; mantém o comportamento do serviço recebido. Se o Flask exigir credenciais, adapte o serviço ao contrato real antes de publicar.

## Conectar ao Shell

Os arquivos em `integration/shell/` são modelos baseados nas versões do Shell enviadas nesta conversa. **Mescle as inclusões nos arquivos atuais**, preservando alterações posteriores.

1. `src/main.ts`: adicione `ordens-compra` no mapa de remotes de desenvolvimento, porta 4305. A ordem `initFederation(...).then(() => import('./bootstrap'))` deve continuar a mesma.
2. `public/federation.manifest.json`: adicione `"ordens-compra": "./remotes/ordens-compra/remoteEntry.json"`.
3. `src/app/app.routes.ts`: adicione o filho `ordens-compra` dentro de `hub`, carregando `loadRemoteModule('ordens-compra', './Routes').then(m => m.ORDENS_COMPRA_ROUTES)`.
4. Mescle as três entradas de `package.scripts.json` em `scripts` do Shell. Elas assumem este projeto como pasta irmã chamada `mfe-daruix-ordens-compra`.
5. Acrescente `npm run start:mfe:ordens-compra` ao comando `dev` com concurrently, e acrescente os respectivos comandos aos encadeamentos `build:mfes` e `sync:mfes`. Para testar sem mexer nesses encadeamentos, rode este MFE e o Shell em terminais separados.
6. Para build local com remotes copiados: execute no Shell `npm run build:mfe:ordens-compra`, `npm run sync:mfe:ordens-compra` e depois `npm run build:shell`.
7. Registre o módulo/funcionalidade no catálogo de navegação do BFF apontando para `ordens-compra`, com permissão `po.ver` e flags de disponibilidade adequadas. A rota e o manifest não criam automaticamente o item no menu. Este pacote não altera dados do BFF.

Não adicione imports diretos dos componentes do remote ao Shell. Mantenha as versões efetivas do Angular e da federação alinhadas também em obras, remessas e cadastros.

## URLs da API

- Desenvolvimento: `src/environments/environment.ts` usa `http://127.0.0.1:5000`, como no código original. Se o navegador estiver em outro dispositivo, configure o hostname/IP acessível do Flask e o CORS correspondente.
- Produção: `src/environments/environment.production.ts` usa `/ordens-compra-api`. O Nginx externo precisa encaminhar esse prefixo para o Flask real. O prefixo é removido pelo `proxy_pass` de exemplo e o Flask recebe `/opened-buy-order`.
- `hubApiUrl` é a URL de autenticação do Hub, não a do Flask. Em produção, `/api`; em desenvolvimento, revise a porta do seu BFF.

## VPS e GitHub Actions

A imagem será `ghcr.io/rickaicka/mfe-ordens-compra:latest`. O workflow não publica nada até você fazer commit/push no seu repositório.

Antes do primeiro deploy:

1. Adicione o serviço do exemplo `integration/vps/compose.ordens-compra.yml` ao `compose.yml` da VPS. O workflow usa os arquivos já existentes `compose.yml` e `compose.source.yml`; o exemplo não é carregado automaticamente.
2. Mescle `integration/vps/nginx-host.conf.example` no Nginx HTTPS do Hub. Ajuste obrigatoriamente o upstream Flask para o endereço real.
3. Configure os secrets do repositório/environment `production`: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`. A variável `VPS_PORT` é opcional (22 por padrão).
4. A VPS precisa ter acesso ao GHCR para imagens privadas.
5. Execute `nginx -t` antes de recarregar a configuração do Nginx externo.

Não sobrescreva os arquivos globais de Compose/Nginx da VPS com os fragmentos de exemplo. A publicação do novo MFE e a atualização do Shell são etapas separadas.

```bash
docker build -t mfe-ordens-compra:local .
```

O container serve estáticos na porta 80 e responde `GET /health`. Os nomes `.dev.js` pertencem ao desenvolvimento: o deploy deve usar `npm run build`, que seleciona produção.

## Verificação

```bash
npm run test:ci
npm run build
```

O endpoint real do Flask, o login no Shell e o deploy na VPS dependem do ambiente do usuário. Consulte `VALIDACAO.md` para os checks executados nesta entrega.

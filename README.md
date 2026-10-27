# Gerenciador de Despesas

Aplicação para controle de despesas e receitas domésticas.

## Stack atual

- Next.js
- React
- TypeScript
- Tailwind CSS

O projeto está sendo migrado da API ASP.NET Core para uma aplicação Next.js. O backend anterior foi preservado em [backend.old/](./backend.old/) como referência.

## Executando o projeto

Instale as dependências na raiz:

```bash
yarn install
```

Inicie o ambiente de desenvolvimento:

```bash
yarn dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Backend do Next.js

As rotas do backend ficam em [app/api/](./app/api/). A rota de verificação está disponível em:

```text
GET /api/health
```

Para validar a aplicação:

```bash
yarn lint
yarn build
```

## Estrutura

```text
├── app/
│   ├── api/              # Route Handlers e serviços de API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend.old/          # API ASP.NET Core anterior
├── data/                 # SQLite local (ignorado pelo Git)
├── public/
└── package.json
```

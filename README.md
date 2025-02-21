# Gestor Odonto

Sistema de gestão para consultórios odontológicos.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM (versão 8 ou superior)
- PostgreSQL (versão 12 ou superior)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd gestor-odonto
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Crie/atualize o arquivo `.env` na pasta backend:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/gestor_odonto"
JWT_SECRET="seu_jwt_secret"
PORT=3333
```

3. Instale as dependências e configure o projeto:
```bash
npm run setup
```

Este comando irá:
- Instalar as dependências do frontend
- Instalar as dependências do backend
- Gerar os tipos do Prisma

4. Configure o banco de dados:
```bash
cd backend
npx prisma migrate dev
```

## Executando o Projeto

Para iniciar tanto o frontend quanto o backend simultaneamente:

```bash
npm run dev
```

Isso irá iniciar:
- Frontend: http://localhost:3000
- Backend: http://localhost:3333

## Scripts Disponíveis

- `npm run dev` - Inicia frontend e backend em modo desenvolvimento
- `npm run frontend` - Inicia apenas o frontend
- `npm run backend` - Inicia apenas o backend
- `npm run build` - Gera build de produção
- `npm run start` - Inicia o projeto em modo produção
- `npm run setup` - Configura o projeto (instalação de dependências e geração de tipos)

## Estrutura do Projeto

```
gestor-odonto/
├── src/              # Código fonte do frontend
├── backend/          # Código fonte do backend
├── public/           # Arquivos públicos
└── prisma/          # Schemas e migrações do banco de dados
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# gestor-odonto" 
"# gestor-odonto" 

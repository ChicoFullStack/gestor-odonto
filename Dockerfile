# Stage 1: Dependências de desenvolvimento
FROM node:18-alpine AS deps
WORKDIR /app

# Copia os arquivos de configuração
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm ci

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copia as dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copia o código fonte
COPY . .

# Gera o Prisma Client e faz o build
RUN npx prisma generate
RUN npm run build

# Stage 3: Produção
FROM node:18-alpine AS runner
WORKDIR /app

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3333

# Copia os arquivos necessários do stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Cria diretório para uploads e define permissões
RUN mkdir -p uploads && chown -R node:node uploads

# Usa um usuário não-root
USER node

# Expõe a porta da aplicação
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"] 
# Stage 1: Dependências de desenvolvimento
FROM node:18-alpine AS deps
WORKDIR /app

# Copia os arquivos de configuração
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install --frozen-lockfile

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copia as dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia o código fonte
COPY . .

# Faz o build do Next.js
RUN npm run build

# Stage 3: Produção
FROM node:18-alpine AS runner
WORKDIR /app

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Copia os arquivos necessários do stage de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Usa um usuário não-root
USER node

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 
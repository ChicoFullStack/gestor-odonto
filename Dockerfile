# Stage 1: Dependências de desenvolvimento
FROM node:18.19-alpine AS deps
WORKDIR /app

# Copia os arquivos de configuração
COPY package.json package-lock.json ./
COPY next.config.js ./

# Instala as dependências
RUN npm install --frozen-lockfile --legacy-peer-deps

# Stage 2: Build
FROM node:18.19-alpine AS builder
WORKDIR /app

# Copia as dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/next.config.js ./

# Copia o código fonte
COPY . .

# Define variável de ambiente para build
ENV NEXT_PUBLIC_API_URL=https://backodonto.boloko.cloud
ENV NODE_ENV=production

# Faz o build do Next.js
RUN npm run build

# Stage 3: Produção
FROM node:18.19-alpine AS runner
WORKDIR /app

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=https://backodonto.boloko.cloud

# Copia os arquivos necessários do stage de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Usa um usuário não-root
USER node

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 
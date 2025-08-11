# Usar Node.js 18 Alpine para imagem mais leve
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache de layers)
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 5000

# Comando para iniciar aplicação
CMD ["npm", "start"]
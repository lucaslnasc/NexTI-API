# NexTI Backend

Backend em Node.js com TypeScript para sistema de gerenciamento de tickets.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Prisma ORM** - ORM moderno para TypeScript/JavaScript
- **PostgreSQL 16** - Banco de dados relacional
- **Docker** - Containerização para desenvolvimento
- **Zod** - Biblioteca de validação de schemas
- **n8n Integration** - Integração com webhooks do n8n

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── routes/           # Rotas do Fastify
│   │   ├── health.routes.ts
│   │   ├── ticket.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/          # Schemas de validação com Zod
│   │   ├── ticket.schema.ts
│   │   └── user.schema.ts
│   ├── services/         # Lógica de negócios
│   │   ├── database.service.ts
│   │   ├── ticket.service.ts
│   │   └── user.service.ts
│   └── index.ts          # Ponto de entrada da aplicação
├── prisma/
│   ├── migrations/       # Migrações do banco de dados
│   └── schema.prisma     # Schema do Prisma
├── docker-compose.yml    # Configuração do PostgreSQL
├── dockerfile            # Build da aplicação
├── .env                  # Variáveis de ambiente
├── .env.example          # Exemplo de configuração
└── package.json          # Dependências e scripts
```

## 🛠️ Configuração Local

### Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose
- npm ou yarn

### 1. Clone e instale dependências

```bash
cd backend
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```env
PORT=5000
DATABASE_URL="postgresql://nexti_user:nexti_password@localhost:5432/nexti_db?schema=public"
N8N_WEBHOOK_URL="https://webhook.site/#!/your-unique-id"
```

### 3. Suba o banco de dados PostgreSQL

```bash
# Subir PostgreSQL via Docker
npm run docker:up

# Verificar se está rodando
docker ps
```

### 4. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Visualizar dados no Prisma Studio
npm run db:studio
```

### 5. Execute a aplicação

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🐳 Scripts Docker

```bash
# Subir PostgreSQL
npm run docker:up

# Parar containers
npm run docker:down

# Ver logs do PostgreSQL
npm run docker:logs

# Reset completo (apaga dados)
npm run docker:reset
```

## 📋 API Endpoints

### Health Check

- **GET** `/healthcheck` - Verifica se a API está funcionando

### Users

- **POST** `/api/users` - Criar novo usuário
- **GET** `/api/users` - Listar usuários
- **GET** `/api/users/:id` - Buscar usuário por ID
- **PATCH** `/api/users/:id` - Atualizar usuário

### Tickets

- **POST** `/api/tickets` - Criar novo ticket
- **GET** `/api/tickets` - Listar tickets (com filtros opcionais)
- **GET** `/api/tickets/:id` - Buscar ticket por ID
- **PATCH** `/api/tickets/:id/status` - Atualizar status do ticket

#### Parâmetros de filtro para GET /api/tickets:

- `status`: open, in_progress, resolved, closed
- `priority`: low, normal, high, urgent
- `userId`: ID do usuário
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)

#### Exemplo de criação de usuário:

```json
POST /api/users
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "(11) 99999-9999"
}
```

#### Exemplo de criação de ticket:

```json
POST /api/tickets
{
  "userId": "clx1234567890",
  "message": "Problema com o sistema de login",
  "priority": "high"
}
```

## 🧪 Testando com Postman

### URLs para teste local:

- **Base URL**: `http://localhost:5000`
- **Health Check**: `GET http://localhost:5000/healthcheck`
- **Users API**: `http://localhost:5000/api/users`
- **Tickets API**: `http://localhost:5000/api/tickets`

### Workflow de teste:

1. Verificar health check
2. Criar um usuário
3. Criar tickets usando o `userId` retornado
4. Listar tickets e usuários

## 🗄️ Banco de Dados

### Configuração PostgreSQL (Docker):

- **Host**: localhost
- **Port**: 5432
- **Database**: nexti_db
- **Username**: nexti_user
- **Password**: nexti_password

### Ferramentas recomendadas:

- **Prisma Studio**: `npm run db:studio` (http://localhost:5555)
- **Postbird**: Cliente PostgreSQL visual
- **pgAdmin**: Interface web completa

## 🚀 Deploy no Render

### 1. Prepare o repositório

Certifique-se de que:

- O código está no GitHub/GitLab
- O arquivo `.env.example` está commitado
- O `Dockerfile` está configurado

### 2. Configure o banco de dados

**Opção 1: PostgreSQL no Render**

1. Crie um PostgreSQL database no Render
2. Use a URL de conexão interna fornecida

**Opção 2: Banco externo**

- Use serviços como Supabase, Railway, ou Neon
- Configure a `DATABASE_URL` com a string de conexão

### 3. Configure o serviço no Render

1. Crie uma nova **Web Service** no [Render](https://render.com)
2. Conecte seu repositório
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Docker**: Se preferir usar o Dockerfile

### 4. Configure as variáveis de ambiente

No painel do Render, adicione:

```
PORT=10000
DATABASE_URL=postgresql://user:pass@host:port/database?schema=public
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/tickets
NODE_ENV=production
```

### 5. Execute as migrações

Após o primeiro deploy:

```bash
# Via Render Shell
npx prisma migrate deploy
```

## 🔧 Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Executa em modo desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript
- `npm start` - Executa a versão compilada

### Banco de dados

- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Executa migrações em desenvolvimento
- `npm run db:studio` - Abre interface visual do banco
- `npm run db:reset` - Reset completo do banco

### Docker

- `npm run docker:up` - Subir PostgreSQL
- `npm run docker:down` - Parar containers
- `npm run docker:logs` - Ver logs do PostgreSQL
- `npm run docker:reset` - Reset completo (apaga dados)

## 🔗 Integração com n8n

O sistema envia automaticamente os tickets criados para um webhook do n8n. Configure a URL do webhook na variável `N8N_WEBHOOK_URL`.

**Payload enviado:**

```json
{
  "id": "uuid",
  "userId": "string",
  "message": "string",
  "status": "string",
  "priority": "string",
  "createdAt": "date",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

## 🚦 Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos (Zod validation)
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 📈 Sugestões de Rotas Adicionais

Para expandir o sistema, considere implementar:

1. **Autenticação de Usuários**

   - `POST /auth/login` - Login
   - `POST /auth/register` - Registro
   - `POST /auth/refresh` - Refresh token

2. **Comentários em Tickets**

   - `POST /api/tickets/:id/comments` - Adicionar comentário
   - `GET /api/tickets/:id/comments` - Listar comentários

3. **Anexos**

   - `POST /api/tickets/:id/attachments` - Upload de arquivo
   - `GET /api/attachments/:id` - Download de arquivo

4. **Relatórios**

   - `GET /api/reports/tickets` - Relatório de tickets
   - `GET /api/reports/users` - Relatório de usuários

5. **WebSocket para atualizações em tempo real**

   - Notificações de novos tickets
   - Atualizações de status

6. **Filtros Avançados**
   - Busca por texto
   - Filtros por data
   - Ordenação customizada

## 🔒 Segurança

- Validação de entrada com Zod
- Sanitização de dados
- Headers de segurança (CORS configurado)
- Tratamento de erros sem exposição de dados sensíveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

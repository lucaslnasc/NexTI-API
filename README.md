# NexTI Backend

Backend em Node.js com TypeScript para gerenciamento de tickets, arquitetura limpa, Supabase e integração n8n.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Supabase** - Backend as a Service (PostgreSQL, autenticação, storage)
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização para desenvolvimento
- **Zod** - Biblioteca de validação de schemas
- **n8n Integration** - Integração com webhooks do n8n

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/      # Controllers HTTP
│   ├── repositories/     # Repositórios de acesso ao banco
│   ├── routes/           # Rotas do Fastify
│   │   ├── health.routes.ts
│   │   ├── ticket.routes.ts
│   │   └── user/
│   ├── schemas/          # Schemas de validação com Zod
│   ├── services/         # Regras de negócio
│   ├── usecases/         # Orquestração de regras
│   └── index.ts          # Ponto de entrada
├── docker-compose.yml    # Configuração do PostgreSQL
├── dockerfile            # Build da aplicação
├── .env                  # Variáveis de ambiente
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
API_HOST=https://nexti-api.onrender.com
PORT=5000
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_KEY="sua-chave"
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/tickets"
```

### 3. Suba o banco de dados PostgreSQL

```bash
# Subir PostgreSQL via Docker
npm run docker:up

# Verificar se está rodando
docker ps
```

### 4. Execute a aplicação

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 📋 API Endpoints

Todas as rotas podem ser testadas via Postman, usando o arquivo `.env` para configurar o host e porta.

### Health Check

- **GET** `/healthcheck` - Verifica se a API está funcionando

### Users

- **POST** `/api/users` - Criar novo usuário
  - **Body:**
    ```json
    {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "(11) 99999-9999",
      "role": "admin",
      "department": "TI",
      "last_login": "2025-08-18T10:00:00.000Z",
      "status": "active",
      "created_at": "2025-08-18T10:00:00.000Z",
      "updated_at": "2025-08-18T10:00:00.000Z"
    }
    ```
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "User created successfully",
      "data": {
        /* dados do usuário */
      }
    }
    ```
- **GET** `/api/users` - Listar usuários
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "Users found",
      "data": [
        /* lista de usuários */
      ]
    }
    ```
- **GET** `/api/users/:id` - Buscar usuário por ID
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "User found",
      "data": {
        /* dados do usuário */
      }
    }
    ```
- **PATCH** `/api/users/:id` - Atualizar usuário
  - **Body:**
    ```json
    {
      "name": "Novo Nome",
      "email": "novo@email.com",
      "phone": "(11) 98888-8888",
      "role": "user",
      "department": "Financeiro",
      "last_login": "2025-08-18T12:00:00.000Z",
      "status": "inactive",
      "created_at": "2025-08-18T10:00:00.000Z",
      "updated_at": "2025-08-18T12:00:00.000Z"
    }
    ```
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "User updated successfully",
      "data": {
        /* dados do usuário atualizado */
      }
    }
    ```
- **DELETE** `/api/users/:id` - Deletar usuário
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "User deleted successfully"
    }
    ```

### Tickets

- **POST** `/api/tickets` - Criar novo ticket
  - **Body:**
    ```json
    {
      "user_id": "clx1234567890",
      "message": "Problema com o sistema de login",
      "status": "open",
      "priority": "high",
      "category": "sistema",
      "assigned_to": "clx0987654321",
      "source": "web",
      "escalation_level": "2",
      "created_at": "2025-08-18T10:00:00.000Z",
      "updated_at": "2025-08-18T10:00:00.000Z",
      "resolved_at": null,
      "resolution_notes": null
    }
    ```
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "Ticket criado com sucesso",
      "data": {
        /* dados do ticket */
      }
    }
    ```
- **GET** `/api/tickets` - Listar tickets (com filtros opcionais)
  - **Query params:**
    - `status`, `priority`, `category`, `assigned_to`, `user_id`, `page`, `limit`
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "Tickets encontrados",
      "data": {
        "tickets": [
          /* lista de tickets */
        ],
        "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
      }
    }
    ```
- **GET** `/api/tickets/:id` - Buscar ticket por ID
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "Ticket encontrado",
      "data": {
        /* dados do ticket */
      }
    }
    ```
- **PATCH** `/api/tickets/:id/status` - Atualizar status do ticket
  - **Body:**
    ```json
    {
      "status": "resolved"
    }
    ```
  - **Resposta:**
    ```json
    {
      "success": true,
      "message": "Status do ticket atualizado com sucesso",
      "data": {
        /* dados do ticket atualizado */
      }
    }
    ```

#### Parâmetros de filtro para GET /api/tickets:

- `status`: open, in_progress, resolved, closed, pending, escalated
- `priority`: low, normal, high, urgent
- `category`: string
- `assigned_to`: uuid
- `user_id`: uuid
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)

### Workflow de teste via Postman:

1. Verificar health check
2. Criar um usuário (POST /api/users)
3. Criar tickets usando o `user_id` retornado (POST /api/tickets)
4. Listar tickets e usuários (GET /api/tickets, GET /api/users)
5. Atualizar status do ticket (PATCH /api/tickets/:id/status)
6. Testar filtros e paginação

## 🚀 Deploy no Render

1. Suba o código para o GitHub
2. Configure as variáveis de ambiente no painel do Render:

```
API_HOST=https://nexti-api.onrender.com
PORT=10000
SUPABASE_URL=...
SUPABASE_KEY=...
N8N_WEBHOOK_URL=...
```

3. Configure build/start:
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Após deploy, use o link do Render como base para o Postman e clientes.

## 🔗 Integração com n8n

O sistema envia automaticamente os tickets criados para um webhook do n8n. Configure a URL do webhook na variável `N8N_WEBHOOK_URL` no `.env` e no Render.

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
2. **Comentários em Tickets**
3. **Anexos**
4. **Relatórios**
5. **WebSocket para atualizações em tempo real**
6. **Filtros Avançados**

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

# NexTI Backend API

API completa em Node.js com TypeScript para gerenciamento de tickets, interações e auditoria. Implementa Clean Architecture, integração com Supabase e webhooks N8N.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Supabase** - Backend as a Service (PostgreSQL, autenticação, storage)
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização para desenvolvimento
- **Zod** - Biblioteca de validação de schemas
- **N8N Integration** - Integração com webhooks do N8N para automação

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Controllers HTTP (Clean Architecture)
│   ├── user.controller.ts
│   ├── ticket.controller.ts
│   ├── interaction.controller.ts
│   └── ticket_history.controller.ts
├── usecases/            # Regras de negócio e orquestração
│   ├── user.usecase.ts
│   ├── ticket.usecase.ts
│   ├── interaction.usecase.ts
│   └── ticket_history.usecase.ts
├── repositories/        # Acesso direto ao banco de dados
│   ├── user.repository.ts
│   ├── ticket.repository.ts
│   ├── interaction.repository.ts
│   └── ticket_history.repository.ts
├── routes/              # Rotas HTTP organizadas por entidade
│   ├── health.routes.ts
│   ├── user.routes.ts
│   ├── ticket.routes.ts
│   ├── interaction.routes.ts
│   ├── ticket_history.routes.ts
│   ├── user/            # Handlers modulares de usuários
│   ├── ticket/          # Handlers modulares de tickets
│   ├── interaction/     # Handlers modulares de interações
│   └── ticket_history/  # Handlers modulares de histórico
├── schemas/             # Schemas de validação com Zod
│   ├── user.schema.ts
│   ├── ticket.schema.ts
│   ├── interaction.schema.ts
│   └── ticket_history.schema.ts
├── lib/                 # Configurações e utilitários
│   └── supabase.ts
├── services/            # Serviços externos e utilitários
│   └── database.service.ts
└── index.ts             # Ponto de entrada do servidor
```

**Arquitetura Clean Architecture:**

- Controller → UseCase → Repository → Database
- Separação clara de responsabilidades
- Facilita testes e manutenção

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
# Server Configuration
API_HOST=https://nexti-api.onrender.com
PORT=5000

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-public-key"

# N8N Integration
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/tickets"

# Environment
NODE_ENV=development
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

Base URL: `https://nexti-api.onrender.com` (produção) ou `http://localhost:5000` (desenvolvimento)

### Health Check

- **GET** `/healthcheck` - Verifica se a API está funcionando
  ```json
  {
    "success": true,
    "message": "API funcionando corretamente",
    "timestamp": "2025-08-20T10:00:00.000Z"
  }
  ```

---

### 👥 Users (Usuários)

#### **POST** `/api/users` - Criar novo usuário

**Body (JSON):**

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "(11) 99999-9999",
  "role": "admin",
  "department": "TI",
  "status": "active"
}
```

**Resposta (201):**

```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "(11) 99999-9999",
    "role": "admin",
    "department": "TI",
    "status": "active",
    "created_at": "2025-08-20T10:00:00.000Z",
    "updated_at": "2025-08-20T10:00:00.000Z"
  }
}
```

#### **GET** `/api/users` - Listar todos os usuários

**Resposta (200):**

```json
{
  "success": true,
  "message": "5 usuários encontrados",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "(11) 99999-9999",
      "role": "admin",
      "department": "TI",
      "status": "active",
      "created_at": "2025-08-20T10:00:00.000Z",
      "updated_at": "2025-08-20T10:00:00.000Z"
    }
  ]
}
```

#### **GET** `/api/users/:id` - Buscar usuário por ID

**Resposta (200):**

```json
{
  "success": true,
  "message": "Usuário encontrado",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "(11) 99999-9999",
    "role": "admin",
    "department": "TI",
    "status": "active",
    "created_at": "2025-08-20T10:00:00.000Z",
    "updated_at": "2025-08-20T10:00:00.000Z"
  }
}
```

#### **PUT** `/api/users/:id` - Atualizar usuário

**Body (JSON):**

```json
{
  "name": "João Silva Atualizado",
  "phone": "(11) 88888-8888",
  "department": "Financeiro"
}
```

**Resposta (200):**

```json
{
  "success": true,
  "message": "Usuário atualizado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva Atualizado",
    "email": "joao@exemplo.com",
    "phone": "(11) 88888-8888",
    "role": "admin",
    "department": "Financeiro",
    "status": "active",
    "created_at": "2025-08-20T10:00:00.000Z",
    "updated_at": "2025-08-20T11:00:00.000Z"
  }
}
```

#### **DELETE** `/api/users/:id` - Deletar usuário

**Resposta (200):**

```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

---

### 🎫 Tickets

#### **POST** `/api/tickets` - Criar novo ticket

**Body (JSON):**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Sistema de login não está funcionando",
  "status": "open",
  "priority": "high",
  "category": "sistema",
  "assigned_to": "660e8400-e29b-41d4-a716-446655440001",
  "source": "web",
  "escalation_level": "1"
}
```

**Resposta (201):**

```json
{
  "success": true,
  "message": "Ticket criado com sucesso",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Sistema de login não está funcionando",
    "status": "open",
    "priority": "high",
    "category": "sistema",
    "assigned_to": "660e8400-e29b-41d4-a716-446655440001",
    "source": "web",
    "escalation_level": "1",
    "created_at": "2025-08-20T10:00:00.000Z",
    "updated_at": "2025-08-20T10:00:00.000Z",
    "resolved_at": null,
    "resolution_notes": null
  }
}
```

#### **GET** `/api/tickets` - Listar tickets com filtros

**Query Parameters (opcionais):**

- `status`: open, in_progress, resolved, closed, pending, escalated
- `priority`: low, normal, high, urgent
- `category`: string
- `assigned_to`: UUID
- `user_id`: UUID
- `page`: número (padrão: 1)
- `limit`: número (padrão: 10, máx: 100)

**Exemplo:** `GET /api/tickets?status=open&priority=high&page=1&limit=5`

**Resposta (200):**

```json
{
  "success": true,
  "message": "Tickets encontrados",
  "data": {
    "tickets": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "message": "Sistema de login não está funcionando",
        "status": "open",
        "priority": "high",
        "category": "sistema",
        "assigned_to": "660e8400-e29b-41d4-a716-446655440001",
        "source": "web",
        "escalation_level": "1",
        "created_at": "2025-08-20T10:00:00.000Z",
        "updated_at": "2025-08-20T10:00:00.000Z",
        "resolved_at": null,
        "resolution_notes": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "totalPages": 5
    }
  }
}
```

#### **GET** `/api/tickets/:id` - Buscar ticket por ID

**Resposta (200):**

```json
{
  "success": true,
  "message": "Ticket encontrado",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Sistema de login não está funcionando",
    "status": "open",
    "priority": "high",
    "category": "sistema",
    "assigned_to": "660e8400-e29b-41d4-a716-446655440001",
    "source": "web",
    "escalation_level": "1",
    "created_at": "2025-08-20T10:00:00.000Z",
    "updated_at": "2025-08-20T10:00:00.000Z",
    "resolved_at": null,
    "resolution_notes": null
  }
}
```

#### **PATCH** `/api/tickets/:id/status` - Atualizar status do ticket

**Body (JSON):**

```json
{
  "status": "resolved",
  "resolution_notes": "Problema resolvido - reinicialização do servidor"
}
```

**Resposta (200):**

```json
{
  "success": true,
  "message": "Status do ticket atualizado com sucesso",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "status": "resolved",
    "resolution_notes": "Problema resolvido - reinicialização do servidor",
    "resolved_at": "2025-08-20T11:00:00.000Z",
    "updated_at": "2025-08-20T11:00:00.000Z"
  }
}
```

---

### 💬 Interactions (Mensagens/Conversas)

#### **POST** `/interactions` - Criar nova interação

**Body (JSON):**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
  "message": "Olá, preciso de ajuda com o sistema de login",
  "sent_by": "customer",
  "channel": "web"
}
```

**Resposta (201):**

```json
{
  "success": true,
  "message": "Interação criada com sucesso",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
    "message": "Olá, preciso de ajuda com o sistema de login",
    "sent_by": "customer",
    "channel": "web",
    "timestamp": "2025-08-20T10:05:00.000Z"
  }
}
```

#### **GET** `/interactions/ticket/:ticketId` - Buscar interações de um ticket

**Resposta (200):**

```json
{
  "success": true,
  "message": "3 interações encontradas",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
      "message": "Olá, preciso de ajuda com o sistema de login",
      "sent_by": "customer",
      "channel": "web",
      "timestamp": "2025-08-20T10:05:00.000Z"
    }
  ]
}
```

#### **GET** `/interactions/:id` - Buscar interação por ID

#### **GET** `/interactions/user/:userId` - Buscar interações de um usuário

#### **GET** `/interactions/ticket/:ticketId/count` - Contar interações de um ticket

#### **PUT** `/interactions/:id` - Atualizar interação

#### **DELETE** `/interactions/:id` - Deletar interação

---

### 📜 Ticket History (Histórico de Auditoria)

#### **POST** `/ticket-history` - Registrar mudança no histórico

**Body (JSON):**

```json
{
  "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "in_progress",
  "changed_by": "660e8400-e29b-41d4-a716-446655440001",
  "notes": "Ticket atribuído para análise técnica"
}
```

**Resposta (201):**

```json
{
  "success": true,
  "message": "Mudança registrada no histórico com sucesso",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
    "status": "in_progress",
    "changed_by": "660e8400-e29b-41d4-a716-446655440001",
    "changed_at": "2025-08-20T10:30:00.000Z",
    "notes": "Ticket atribuído para análise técnica"
  }
}
```

#### **GET** `/ticket-history/ticket/:ticketId` - Buscar histórico de um ticket

**Resposta (200):**

```json
{
  "success": true,
  "message": "2 entradas encontradas no histórico",
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
      "status": "open",
      "changed_by": "system",
      "changed_at": "2025-08-20T10:00:00.000Z",
      "notes": "Ticket criado"
    },
    {
      "id": "991e8400-e29b-41d4-a716-446655440000",
      "ticket_id": "770e8400-e29b-41d4-a716-446655440000",
      "status": "in_progress",
      "changed_by": "660e8400-e29b-41d4-a716-446655440001",
      "changed_at": "2025-08-20T10:30:00.000Z",
      "notes": "Ticket atribuído para análise técnica"
    }
  ]
}
```

#### **GET** `/ticket-history/ticket/:ticketId/report` - Gerar relatório de atividade

**Resposta (200):**

```json
{
  "success": true,
  "message": "Relatório de atividade gerado com sucesso",
  "data": {
    "totalChanges": 3,
    "firstChange": {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "status": "open",
      "changed_at": "2025-08-20T10:00:00.000Z"
    },
    "lastChange": {
      "id": "992e8400-e29b-41d4-a716-446655440000",
      "status": "resolved",
      "changed_at": "2025-08-20T11:00:00.000Z"
    },
    "statusChanges": [
      { "status": "open", "count": 1 },
      { "status": "in_progress", "count": 1 },
      { "status": "resolved", "count": 1 }
    ],
    "uniqueUsers": ["system", "660e8400-e29b-41d4-a716-446655440001"]
  }
}
```

#### Outros endpoints do Ticket History:

- **GET** `/ticket-history/:id` - Buscar entrada específica
- **GET** `/ticket-history/user/:userId` - Buscar por usuário
- **GET** `/ticket-history/status/:status` - Buscar por status
- **GET** `/ticket-history/date-range?startDate=2025-08-01&endDate=2025-08-31` - Buscar por período
- **GET** `/ticket-history/ticket/:ticketId/count` - Contar entradas
- **GET** `/ticket-history/ticket/:ticketId/latest` - Buscar última entrada

## 🧪 Testando com Postman

### Configuração Inicial

1. **Importe as variáveis de ambiente:**

   ```json
   {
     "api_url": "https://nexti-api.onrender.com",
     "local_url": "http://localhost:5000"
   }
   ```

2. **Use `{{api_url}}` nas suas requisições para produção ou `{{local_url}}` para desenvolvimento**

### Fluxo de Teste Completo

#### 1. Verificar Health Check

```
GET {{api_url}}/healthcheck
```

#### 2. Criar Usuário

```
POST {{api_url}}/api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "(11) 99999-9999",
  "role": "admin",
  "department": "TI",
  "status": "active"
}
```

**➡️ Salve o `id` retornado como `user_id`**

#### 3. Criar Ticket

```
POST {{api_url}}/api/tickets
Content-Type: application/json

{
  "user_id": "{{user_id}}",
  "message": "Sistema de login não está funcionando",
  "status": "open",
  "priority": "high",
  "category": "sistema",
  "source": "web",
  "escalation_level": "1"
}
```

**➡️ Salve o `id` retornado como `ticket_id`**

#### 4. Criar Interação (Mensagem no Ticket)

```
POST {{api_url}}/interactions
Content-Type: application/json

{
  "user_id": "{{user_id}}",
  "ticket_id": "{{ticket_id}}",
  "message": "Olá, preciso de ajuda urgente com o sistema de login",
  "sent_by": "customer",
  "channel": "web"
}
```

#### 5. Registrar Mudança no Histórico

```
POST {{api_url}}/ticket-history
Content-Type: application/json

{
  "ticket_id": "{{ticket_id}}",
  "status": "in_progress",
  "changed_by": "{{user_id}}",
  "notes": "Ticket atribuído para análise técnica"
}
```

#### 6. Consultar Dados

**Listar todos os usuários:**

```
GET {{api_url}}/api/users
```

**Buscar usuário específico:**

```
GET {{api_url}}/api/users/{{user_id}}
```

**Listar tickets com filtros:**

```
GET {{api_url}}/api/tickets?status=open&priority=high&page=1&limit=10
```

**Ver conversas do ticket:**

```
GET {{api_url}}/interactions/ticket/{{ticket_id}}
```

**Ver histórico completo do ticket:**

```
GET {{api_url}}/ticket-history/ticket/{{ticket_id}}
```

**Gerar relatório de atividade:**

```
GET {{api_url}}/ticket-history/ticket/{{ticket_id}}/report
```

#### 7. Atualizar Status do Ticket

```
PATCH {{api_url}}/api/tickets/{{ticket_id}}/status
Content-Type: application/json

{
  "status": "resolved",
  "resolution_notes": "Problema resolvido - senha resetada"
}
```

#### 8. Adicionar Resposta de Suporte

```
POST {{api_url}}/interactions
Content-Type: application/json

{
  "user_id": "{{user_id}}",
  "ticket_id": "{{ticket_id}}",
  "message": "Problema resolvido! Sua senha foi resetada e enviada por email.",
  "sent_by": "support",
  "channel": "internal"
}
```

### Collection do Postman (Importar JSON)

```json
{
  "info": {
    "name": "NexTI API",
    "description": "API completa para gerenciamento de tickets"
  },
  "variable": [
    {
      "key": "api_url",
      "value": "https://nexti-api.onrender.com"
    },
    {
      "key": "user_id",
      "value": ""
    },
    {
      "key": "ticket_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{api_url}}/healthcheck"
      }
    },
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "url": "{{api_url}}/api/users",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@exemplo.com\",\n  \"phone\": \"(11) 99999-9999\",\n  \"role\": \"admin\",\n  \"department\": \"TI\",\n  \"status\": \"active\"\n}"
        }
      }
    },
    {
      "name": "Create Ticket",
      "request": {
        "method": "POST",
        "url": "{{api_url}}/api/tickets",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": \"{{user_id}}\",\n  \"message\": \"Sistema de login não está funcionando\",\n  \"status\": \"open\",\n  \"priority\": \"high\",\n  \"category\": \"sistema\",\n  \"source\": \"web\",\n  \"escalation_level\": \"1\"\n}"
        }
      }
    }
  ]
}
```

### Casos de Teste Específicos

#### Teste de Filtros Avançados

```
GET {{api_url}}/api/tickets?status=open&priority=high&category=sistema
GET {{api_url}}/ticket-history/user/{{user_id}}
GET {{api_url}}/ticket-history/status/resolved
GET {{api_url}}/ticket-history/date-range?startDate=2025-08-01T00:00:00.000Z&endDate=2025-08-31T23:59:59.999Z
```

#### Teste de Contadores

```
GET {{api_url}}/interactions/ticket/{{ticket_id}}/count
GET {{api_url}}/ticket-history/ticket/{{ticket_id}}/count
```

#### Teste de Erros (Status 400/404)

```
GET {{api_url}}/api/users/invalid-uuid
POST {{api_url}}/api/users
{
  "email": "email-invalido"
}
```

## � Deploy no Render

### Configuração no Render

1. **Conecte seu repositório GitHub**
2. **Configure as variáveis de ambiente:**

```env
# Server
API_HOST=https://nexti-api.onrender.com
PORT=10000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key

# N8N Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/tickets
```

3. **Build e Start Commands:**

   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Após o deploy:**
   - Use a URL do Render como base: `https://nexti-api.onrender.com`
   - Teste todos os endpoints com Postman
   - Verifique os logs para debug se necessário

### Monitoramento

- Health check: `https://nexti-api.onrender.com/healthcheck`
- Logs disponíveis no painel do Render
- Supabase dashboard para monitorar banco de dados

## �🔗 Integração com N8N

O sistema envia automaticamente novos tickets para o N8N via webhook para automação de workflows.

### Configuração N8N

1. **Crie um webhook trigger no N8N**
2. **Configure a URL no `.env`:**
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/tickets
   ```

### Payload Enviado

Quando um ticket é criado, o seguinte payload é enviado:

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Sistema de login não está funcionando",
  "status": "open",
  "priority": "high",
  "category": "sistema",
  "source": "web",
  "created_at": "2025-08-20T10:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "department": "TI"
  }
}
```

### Casos de Uso N8N

- **Notificações automáticas** por email/Slack
- **Atribuição inteligente** baseada em categoria/prioridade
- **Escalação automática** para prioridades altas
- **Integração com sistemas externos** (CRM, ITSM)
- **Relatórios automatizados** de performance

## 🚦 Status Codes e Tratamento de Erros

### Códigos de Resposta

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos (validação Zod)
- **404** - Recurso não encontrado
- **409** - Conflito (ex: email já existe)
- **500** - Erro interno do servidor

### Formato de Erro Padrão

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "email",
      "message": "Email deve ser válido"
    }
  ]
}
```

### Tratamento de Erros no Cliente

```javascript
// Exemplo de tratamento em JavaScript
async function createUser(userData) {
  try {
    const response = await fetch("https://nexti-api.onrender.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!result.success) {
      console.error("Erro:", result.message);
      if (result.errors) {
        result.errors.forEach((error) => {
          console.error(`Campo ${error.field}: ${error.message}`);
        });
      }
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Erro de rede:", error);
    return null;
  }
}
```

## 📈 Roadmap e Próximas Features

### Versão 2.0 (Planejado)

1. **Autenticação e Autorização**

   - JWT tokens
   - Roles e permissions
   - OAuth2 integration

2. **Real-time Features**

   - WebSocket para atualizações em tempo real
   - Notificações push
   - Chat ao vivo

3. **Advanced Features**

   - Upload de anexos
   - Templates de respostas
   - SLA tracking
   - Dashboard analytics

4. **Integrações**
   - API de Email (SendGrid/AWS SES)
   - Slack/Teams notifications
   - Mobile app API

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📋 Checklist de Testes

- [ ] Health check responde corretamente
- [ ] CRUD de usuários funciona
- [ ] CRUD de tickets funciona
- [ ] Interações são criadas e listadas
- [ ] Histórico é registrado automaticamente
- [ ] Filtros e paginação funcionam
- [ ] Webhook N8N é disparado
- [ ] Validações Zod estão funcionando
- [ ] Logs de debug aparecem corretamente
- [ ] Variáveis de ambiente estão configuradas

## 🔒 Segurança

### Implementações Atuais

- ✅ Validação de entrada com Zod
- ✅ Sanitização de dados
- ✅ Headers de segurança (CORS)
- ✅ Tratamento de erros sem exposição de dados sensíveis
- ✅ Logs de auditoria (ticket_history)

### Recomendações para Produção

- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Autenticação JWT
- [ ] Criptografia de dados sensíveis
- [ ] Backup automatizado
- [ ] Monitoramento de segurança

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para NexTI**

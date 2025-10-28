# 💬 Plataforma de Chat PurPura

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18%2B-green.svg)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange.svg)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Uma plataforma de comunicação em tempo real para conectar empresas do ecossistema **PurPura**, com suporte da assistente de IA **PurpurIA** para um atendimento rápido e intuitivo.

## ✨ O que o site oferece

- **Conversas entre empresas**: trocas diretas e privadas, organizadas por lista de conversas e páginas de chat
- **Mensagens instantâneas**: envio e recebimento na hora, sem precisar recarregar a página
- **Indicador de digitação**: mostra as "três bolinhas" enquanto alguém está escrevendo
- **Contagem de não lidas**: cada conversa exibe quantas mensagens do outro participante ainda não foram lidas
- **Suporte com IA (PurpurIA)**: canal dedicado para dúvidas e orientação
- **Mensagens com formatação**: suporte a textos com formatação simples (Markdown) para melhor leitura
- **Área Restrita**: dashboard com Business Intelligence (BI) integrado
- **Separadores de data**: organização visual de mensagens por dia
- **Interface responsiva**: adaptação automática para dispositivos móveis e desktop

## 🛠️ Tecnologias usadas

- **React 19**: base da interface, garantindo navegação simples e componentes reutilizáveis
- **TypeScript**: aumenta a segurança do código e reduz erros
- **Firebase Authentication**: gerenciamento de autenticação e sessão de usuários
- **WebSockets com STOMP**: mantém o chat em tempo real, com entrega imediata de mensagens
- **Zustand**: guarda conversas, mensagens, empresas e o status de digitação de forma leve
- **React Router**: organiza a navegação entre a lista de chats e cada conversa
- **date-fns e Lucide**: padronizam datas e oferecem ícones modernos e leves
- **React Markdown**: renderização de mensagens com formatação Markdown
- **crypto-js**: utilitários de criptografia para segurança de dados

## 📁 Estrutura do Projeto

### Organização Geral
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── hooks/              # Custom React hooks
├── store/              # Gerenciamento de estado (Zustand)
├── services/           # Serviços de API
├── auth/               # Autenticação e sessão
├── App.tsx             # Componente principal
├── AppBootstrap.tsx    # Inicialização da aplicação
└── index.tsx           # Ponto de entrada
```

### Componentes (`src/components/`)

Cada componente possui sua própria pasta com arquivos `.tsx` e `.css`:

- **`AuthGate/`** - Controla acesso e autenticação da aplicação
- **`Header/`** - Cabeçalho com navegação e informações da conversa
- **`ChatHistory/`** - Histórico de mensagens com scroll automático
- **`ChatInput/`** - Campo de entrada de mensagens
- **`ChatMessage/`** - Renderização individual de mensagens
- **`ChatListItem/`** - Item da lista de conversas
- **`DateSeparator/`** - Separador de datas entre mensagens
- **`TypingIndicator/`** - Indicador de digitação animado

### Páginas (`src/pages/`)

Cada página representa uma rota da aplicação:

- **`ChatListPage/`** - Lista principal de conversas (`/`)
- **`ConversationPage/`** - Página individual de conversa (`/chat/:conversationId`)
- **`SupportPage/`** - Canal de suporte com PurpurIA (`/suporte`)
- **`AreaRestrita/`** - Dashboard BI integrado (`/arearestrita`)
- **`PathLoginPage/`** - Página de login via hash (`/:loginHash/`)

#### Rotas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Lista de todas as conversas |
| `/chat/:conversationId` | Conversa específica |
| `/suporte` | Canal de suporte com PurpurIA |
| `/arearestrita` | Dashboard de Business Intelligence |
| `/:loginHash/` | Login via hash específico |
| `/#cnpj=CNPJ` | Autenticação via CNPJ no hash |
| `/?cnpj=CNPJ` | Autenticação via CNPJ na query |

### Hooks Customizados (`src/hooks/`)

- **`useStompChat`** - Gerencia conexão WebSocket, autenticação automática e envio de mensagens em tempo real

#### Funcionalidades do useStompChat:

**🔐 Autenticação Automática:**
- **Detecção de CNPJ na URL**: Suporte a `#cnpj=CNPJ` e `?cnpj=CNPJ`
- **Autenticação centralizada**: Verifica status de autenticação antes de conectar WebSocket
- **Limpeza automática de URL**: Remove parâmetros sensíveis após autenticação
- **Persistência de sessão**: Mantém usuário autenticado entre navegações

**🔄 Fluxos de Acesso Suportados:**
1. **Fluxo Padrão**: `/#cnpj=12345678000199` → Lista de conversas
2. **Acesso Direto**: `/chat/123/#cnpj=12345678000199` → Chat específico
3. **Sessão Existente**: Usuário já autenticado → Conexão direta

**⚡ Características Técnicas:**
- **Validação em tempo real**: Verifica autenticação antes de estabelecer conexão
- **Fallback inteligente**: Tenta autenticação via URL se sessão não existir
- **Type Safety**: Interface `SessionUser` para tipagem segura
- **Error Handling**: Tratamento robusto de falhas de autenticação

### Gerenciamento de Estado (`src/store/`)

- **`chatStore.ts`** - Store Zustand com:
  - Conversas e mensagens
  - Dados das empresas
  - Status de digitação
  - Contadores de não lidas

### Serviços (`src/services/`)

- **`chatApi.ts`** - Funções para comunicação com API REST:
  - Buscar conversas
  - Carregar mensagens
  - Obter dados de empresas

### Autenticação (`src/auth/`)

- **`authState.ts`** - Gerenciamento de sessão e status de autenticação
- **`hmac.ts`** - Utilitários de segurança e criptografia

### Configuração (`src/`)

- **`firebaseConfig.ts`** - Configuração e inicialização do Firebase Authentication
  - Validação automática de variáveis de ambiente
  - Exporta instância do Firebase Auth
  - Tratamento de erros de configuração

## ⚙️ Inicialização da Aplicação

### AppBootstrap (`src/AppBootstrap.tsx`)

O `useHashLoginBootstrap` é responsável por:

1. **Detectar parâmetros de login** via hash (`#cnpj=...`) ou query string (`?cnpj=...`)
2. **Validar CNPJ** e buscar dados da empresa na API
3. **Configurar sessão** com dados do usuário
4. **Limpar URL** removendo parâmetros sensíveis
5. **Definir status de autenticação** (loading, ok, error, etc.)

### Fluxo de Autenticação

```
1. Usuário acessa com #cnpj=12345678000199
2. AppBootstrap detecta o CNPJ
3. Busca dados da empresa na API
4. Configura sessão com dados do usuário
5. Remove CNPJ da URL por segurança
6. Define status como 'ok' para permitir acesso
```

### Fluxos de Acesso

#### 🔗 Acesso Direto a Chats
O sistema suporta acesso direto a conversas específicas via URL:

**Padrão de URL:**
```
/chat/{CHAT_ID}/#cnpj={CNPJ_DO_USUARIO}
```

**Exemplo:**
```
/chat/123456/#cnpj=12345678000199
```

**Fluxo de Execução:**
1. Usuário acessa URL com chat específico e CNPJ
2. `useStompChat` detecta necessidade de autenticação
3. Autenticação automática usando CNPJ da URL
4. Conexão WebSocket estabelecida para o chat específico
5. Usuário conectado diretamente à conversa

#### 🔄 Compatibilidade de Fluxos

| URL Pattern | Comportamento |
|-------------|---------------|
| `/#cnpj=CNPJ` | Autenticação → Lista de conversas |
| `/chat/ID/#cnpj=CNPJ` | Autenticação → Chat específico |
| `/chat/ID/` (sessão ativa) | Conexão direta ao chat |

#### 🛡️ Segurança e Persistência
- **Limpeza automática de URL**: Parâmetros sensíveis removidos após autenticação
- **Sessão persistente**: Login mantido entre navegações
- **Fallback inteligente**: Tenta autenticação via URL se sessão não existir
- **Type Safety**: Validação de tipos em todas as operações de autenticação

## 🔄 Fluxo de Dados

### Comunicação em Tempo Real

1. **Conexão WebSocket** via `useStompChat`
2. **Subscrição** ao tópico `/topic/chat.{conversationId}`
3. **Recebimento** de mensagens em tempo real
4. **Atualização** do store Zustand
5. **Re-renderização** automática dos componentes

### Gerenciamento de Estado

```
API REST → chatApi.ts → chatStore.ts → Componentes
WebSocket → useStompChat → chatStore.ts → Componentes
```

## 🔒 Segurança

### Práticas de Segurança Implementadas

- **Limpeza automática de URL**: Parâmetros sensíveis (CNPJ) são removidos da URL após autenticação
- **Validação de CNPJ**: Verificação do formato e existência do CNPJ no backend
- **Criptografia de dados**: Uso de crypto-js para operações criptográficas
- **HMAC para integridade**: Verificação de integridade de dados sensíveis
- **Firebase Authentication**: Gerenciamento seguro de sessões
- **Type Safety**: TypeScript previne erros de tipo em toda a aplicação
- **Variáveis de ambiente**: Credenciais nunca são commitadas no código

## 🚀 Como executar

### Pré-requisitos

**Obrigatório:**
- Node.js 18+ ou Node.js 20 (recomendado)
- NPM 8+ ou Yarn 1.22+
- Conta Firebase (para autenticação)

### Instalação

1. **Clonar o projeto**
```bash
git clone https://github.com/PurPuraAmbiental/PurPura-react-site.git
cd PurPura-react-site
```

2. **Instalar dependências**
```bash
npm install
# ou
yarn install
```

3. **Configurar ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API, ChatBot e WebSocket
REACT_APP_API_URL=https://URL_DA_API
REACT_APP_WEBSOCKET_URL=wss://URL_DO_WEBSOCKET
REACT_APP_CHATBOT_URL=https://URL_DO_CHATBOT

# Firebase Authentication
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

> **Nota**: As variáveis do Firebase são obrigatórias para o funcionamento da autenticação.

**Como obter as credenciais do Firebase:**
1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto ou crie um novo
3. Vá em Configurações do Projeto > Geral
4. Em "Seus apps", selecione o app web ou crie um novo
5. Copie as credenciais da configuração do Firebase

4. **Executar em desenvolvimento**
```bash
npm start
# ou
yarn start
```

Acesse: http://localhost:3000

### Build de Produção

```bash
npm run build
```

Gera os arquivos otimizados na pasta `build/` para deploy.

### Configuração de Roteamento

O projeto inclui arquivos de configuração para garantir que todas as rotas funcionem corretamente:

**Para Render/servidores Node.js (`static.json`):**
```json
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  }
}
```

## 🧪 Desenvolvimento

### Estrutura de Componentes

Cada componente segue o padrão:
```
ComponentName/
├── ComponentName.tsx    # Lógica do componente
├── ComponentName.css    # Estilos específicos
```

### Adicionando Novos Componentes

1. Crie a pasta em `src/components/`
2. Adicione os arquivos `.tsx` e `.css`
3. Importe diretamente: `import Component from './components/Component/Component'`

### Adicionando Novas Páginas

1. Crie a pasta em `src/pages/`
2. Adicione os arquivos `.tsx` e `.css` (se necessário)
3. Configure a rota em `src/App.tsx`
4. Importe: `import Page from './pages/Page/Page'`

## 🔧 Manutenção

### Logs e Debug

- **WebSocket**: Logs no console com prefixo `[STOMP]`
- **Envio de mensagens**: Logs com prefixo `[SEND]`
- **Autenticação**: Status visível no `AuthGate`

### Troubleshooting

- **Conexão WebSocket falha**: Verifique `REACT_APP_WEBSOCKET_URL`
- **API não responde**: Verifique `REACT_APP_API_URL`
- **Rotas não funcionam**: Confirme `static.json` no deploy

## 👨‍💻 Autor

**Emilio Stuart** - [@EmilioStuart](https://github.com/EmilioStuart)
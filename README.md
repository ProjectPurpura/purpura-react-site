# 💬 Plataforma de Chat Purpura

Uma plataforma de comunicação em tempo real para conectar empresas do ecossistema **Purpura**, com suporte da assistente de IA **PurpurIA** para um atendimento rápido e intuitivo.

## ✨ O que o site oferece

- **Conversas entre empresas**: trocas diretas e privadas, organizadas por lista de conversas e páginas de chat
- **Mensagens instantâneas**: envio e recebimento na hora, sem precisar recarregar a página
- **Indicador de digitação**: mostra as "três bolinhas" enquanto alguém está escrevendo
- **Contagem de não lidas**: cada conversa exibe quantas mensagens do outro participante ainda não foram lidas
- **Suporte com IA (PurpurIA)**: canal dedicado para dúvidas e orientação
- **Mensagens com formatação**: suporte a textos com formatação simples (Markdown) para melhor leitura

## 🛠️ Tecnologias usadas

- **React**: base da interface, garantindo navegação simples e componentes reutilizáveis
- **TypeScript**: aumenta a segurança do código e reduz erros
- **WebSockets com STOMP**: mantém o chat em tempo real, com entrega imediata de mensagens
- **Zustand**: guarda conversas, mensagens, empresas e o status de digitação de forma leve
- **React Router**: organiza a navegação entre a lista de chats e cada conversa
- **date-fns e Lucide**: padronizam datas e oferecem ícones modernos e leves

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

- **`ChatListPage/`** - Lista principal de conversas
- **`ConversationPage/`** - Página individual de conversa
- **`SupportPage/`** - Canal de suporte com PurpurIA
- **`AreaRestrita/`** - Dashboard BI integrado
- **`PathLoginPage/`** - Página de login via hash

### Hooks Customizados (`src/hooks/`)

- **`useStompChat`** - Gerencia conexão WebSocket e envio de mensagens em tempo real

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
- **`hmac.ts`** - Utilitários de segurança

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

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Instalação

1. **Clonar o projeto**
```bash
git clone https://github.com/PurPuraAmbiental/purpura-react-site.git
cd purpura-react-site
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
REACT_APP_API_URL=https://URL_DA_API
REACT_APP_WEBSOCKET_URL=wss://URL_DO_WEBSOCKET
```

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

## 🌐 Deploy

### Render (Recomendado)

1. Conecte o repositório ao Render
2. Configure como "Static Site"
3. **Build Command**: `npm run build`
4. **Publish Directory**: `build`
5. Configure as variáveis de ambiente no dashboard

### Configuração de Roteamento

O projeto inclui `static.json` para garantir que todas as rotas funcionem corretamente:

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
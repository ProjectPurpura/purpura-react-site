# 💬 Plataforma de Chat Purpura

Uma plataforma de comunicação em tempo real para conectar empresas do ecossistema **Purpura**, com suporte da assistente de IA **PurpurIA** para um atendimento rápido e intuitivo.

## ✨ O que o site oferece

- Conversas entre empresas: trocas diretas e privadas, organizadas por lista de conversas e páginas de chat.  
- Mensagens instantâneas: envio e recebimento na hora, sem precisar recarregar a página.  
- Indicador de digitação: mostra as “três bolinhas” enquanto alguém está escrevendo.  
- Contagem de não lidas: cada conversa exibe quantas mensagens do outro participante ainda não foram lidas.  
- Suporte com IA (PurpurIA): canal dedicado para dúvidas e orientação.  
- Mensagens com formatação: suporte a textos com formatação simples (Markdown) para melhor leitura.  

## 🛠️ Tecnologias usadas

- React: base da interface, garantindo navegação simples e componentes reutilizáveis.  
- TypeScript: aumenta a segurança do código e reduz erros.  
- WebSockets com STOMP: mantém o chat em tempo real, com entrega imediata de mensagens.  
- Zustand: guarda conversas, mensagens, empresas e o status de digitação de forma leve.  
- React Router: organiza a navegação entre a lista de chats e cada conversa.  
- date-fns e Lucide: padronizam datas e oferecem ícones modernos e leves.  

## ⚙️ Como funciona por trás

- API REST: carrega conversas, mensagens e dados das empresas.  
- Canal em tempo real: cada conversa tem um “tópico” próprio onde as mensagens são trocadas.  
- Indicador de leitura: o site pode marcar mensagens como lidas quando a conversa é aberta.  

## 🚀 Como executar

1) Pré-requisitos  
- Node.js 18+  
- NPM ou Yarn  

2) Clonar o projeto  
```
git clone https://github.com/PurPuraAmbiental/purpura-react-site.git
cd purpura-react-site
```

3) Instalar dependências  
```
npm install
# ou
yarn install
```

4) Configurar o ambiente  
Crie um arquivo .env a partir do exemplo:  
```
cp .env.example .env
```
Preencha as URLs da API e do servidor WebSocket.

5) Rodar em desenvolvimento  
```
npm start
# ou
yarn start
```
Abra http://localhost:3000

## 🌐 Build de produção

```
npm run build
```
Gera os arquivos otimizados na pasta build para publicar em produção.
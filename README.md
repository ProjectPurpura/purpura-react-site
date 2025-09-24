# 💬 Plataforma de Chat Purpura (V0.2.0)

Uma plataforma de comunicação moderna e em tempo real, desenvolvida para ser o hub de mensagens do ecossistema **Purpura**. Este projeto oferece uma experiência de chat B2B fluida, permitindo que empresas se comuniquem de forma eficiente, além de integrar a **Nara**, a assistente de IA, para um suporte rápido e intuitivo.

## ✨ Principais Funcionalidades

A aplicação foi desenvolvida com foco em reatividade, comunicação em tempo real e boas práticas de desenvolvimento.

* **💬 Chat Multi-Empresas:** O coração da plataforma, permitindo conversas diretas e privadas entre diferentes empresas cadastradas no ecossistema Purpura.
* **⚡ Comunicação em Tempo Real:** Utiliza **WebSockets** com o protocolo **STOMP** para uma troca de mensagens instantânea, garantindo que as conversas fluam sem atrasos.
* **🤖 Integração com a IA Nara:** Inclui um chat de suporte dedicado com a Nara, a IA da Purpura, para responder a dúvidas e oferecer assistência.
* **🌐 Roteamento de Páginas:** Arquitetura multi-página com **React Router**, com uma tela principal para a lista de chats e rotas dinâmicas para cada conversa individual.
* **🧠 Gerenciamento de Estado com Zustand:** Utiliza Zustand para um gerenciamento de estado global leve e sem boilerplate, controlando as conversas, mensagens e detalhes de empresas de forma centralizada e eficiente.
* **✍️ Respostas Formatadas com Markdown:** As mensagens (tanto de usuários quanto da IA) são renderizadas como Markdown, permitindo a exibição de textos formatados.
* **🔒 Código Fortemente Tipado:** Desenvolvido inteiramente em **TypeScript**, o que garante maior segurança e previsibilidade na integração com as APIs.
* **🎨 Ícones Modernos:** Integra a biblioteca **Lucide-React** para ícones SVG leves e consistentes.

## 🛠️ Arquitetura e Tecnologias Utilizadas

A arquitetura do projeto segue o padrão de componentização do React, com uma separação clara entre a UI (componentes), a lógica de estado (store) e a comunicação com serviços (API).

* **Linguagem:** **TypeScript**
* **Framework:** **React**
* **Bibliotecas Principais:**
    * **Zustand:** Para gerenciamento de estado global.
    * **React Router DOM:** Para o roteamento de páginas.
    * **@stomp/stompjs:** Para a comunicação via WebSocket com o protocolo STOMP.
    * **React-Markdown:** Para renderização de mensagens formatadas.
    * **date-fns:** Para formatação e manipulação de datas.
    * **Lucide-React:** Para a biblioteca de ícones.
* **Build Tool:** **Create React App (react-scripts)**

## ⚙️ APIs Utilizadas

O projeto se conecta a um back-end robusto que expõe duas interfaces principais:

1.  **API REST:** Responsável por:
    * Listar as conversas de um usuário (`GET /chat/user/{id}`).
    * Buscar o histórico de mensagens de um chat específico (`GET /chat/{chatId}/messages`).
    * Obter os detalhes de uma empresa (`GET /empresa/{id}`).
2.  **Servidor WebSocket (via STOMP):** Responsável pela troca de mensagens em tempo real, com um tópico dinâmico para cada conversa (`/topic/chat.{chatId}`).

## 🚀 Como Executar o Projeto

Para clonar e executar esta aplicação localmente, siga os passos abaixo.

1.  **Pré-requisitos:**
    * Node.js (versão 18 ou superior)
    * NPM ou Yarn

2.  **Clonagem do Repositório:**
    ```bash
    git clone https://github.com/PurPuraAmbiental/purpura-react-site.git
    cd purpura-react-site
    ```

3.  **Instalação das Dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

4.  **Configuração do Ambiente (Passo Crucial!)**
    Na raiz do projeto, crie um arquivo chamado `.env` a partir do exemplo. Você pode fazer isso copiando o arquivo de exemplo:
    ```bash
    cp .env.example .env
    ```
    Em seguida, abra o arquivo `.env` e preencha as URLs corretas para a sua API e o servidor WebSocket.

5.  **Execução em Modo de Desenvolvimento:**
    ```bash
    npm start
    ```
    ou
    ```bash
    yarn start
    ```
    O aplicativo será aberto automaticamente no seu navegador em `http://localhost:3000`.

## 🌐 Deploy

Para gerar uma versão de produção otimizada do projeto, execute o seguinte comando:
```bash
npm run build

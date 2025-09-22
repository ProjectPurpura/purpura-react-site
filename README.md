# 💬 Chat Purpura - Interface para a IA Nara (V0.1.0)

Uma interface de chat moderna desenvolvida para ser o cliente oficial da **Nara**, a assistente de IA do aplicativo Purpura. Este projeto oferece uma experiência de usuário fluida para que os usuários possam tirar suas dúvidas sobre as funcionalidades do Purpura de forma interativa e intuitiva.

## ✨ Principais Funcionalidades

A aplicação foi desenvolvida com foco em reatividade e boas práticas, resultando em uma interface de usuário coesa e funcional para a interação com a chatbot.

* **⚛️ Interface Reativa com React 19:** Construído sobre a versão mais recente do React, garantindo acesso às otimizações e funcionalidades mais modernas do framework para uma experiência de conversa sem interrupções.
* **🧠 Gerenciamento de Estado com Zustand:** Utiliza Zustand para um gerenciamento de estado global leve e sem boilerplate, controlando o histórico da conversa e o estado da interface de forma simples e poderosa.
* **✍️ Respostas Formatadas com Markdown:** As respostas da IA Nara são renderizadas como Markdown, permitindo a exibição de textos formatados com **negrito**, *itálico*, `código`, listas e mais.
* **🧩 Arquitetura Baseada em Componentes:** A interface é dividida em componentes lógicos e reutilizáveis (`ChatHistory`, `ChatInput`, `ChatMessage`), facilitando a manutenção e a clareza do código.
* **🔒 Código Fortemente Tipado:** Desenvolvido inteiramente em **TypeScript**, o que garante maior segurança, previsibilidade e uma melhor experiência de desenvolvimento na integração com a API.
* **🎨 Ícones Modernos:** Integra a biblioteca **Lucide-React** para ícones SVG leves, consistentes e visualmente agradáveis em toda a interface.

## 🛠️ Arquitetura e Tecnologias Utilizadas

A arquitetura do projeto segue o padrão de componentização do React, com uma separação clara entre a UI (componentes) e a lógica de estado (store).

* **Linguagem:** **TypeScript**
* **Framework:** **React (v19)**
* **Bibliotecas Principais:**
    * **Zustand:** Para gerenciamento de estado global.
    * **React-Markdown:** Para renderização de respostas formatadas.
    * **Lucide-React:** Para a biblioteca de ícones.
    * **React Testing Library:** Para a suíte de testes da aplicação.
* **Build Tool:** **Create React App (react-scripts)**

## ⚙️ APIs Utilizadas

Este projeto foi projetado para se conectar à **API da Nara**, o serviço de back-end que processa as mensagens dos usuários e retorna as respostas da chatbot. Toda a comunicação e a lógica da conversa são gerenciadas por esta API específica.

## 🚀 Como Executar o Projeto

Para clonar e executar esta aplicação localmente, siga os passos abaixo.

1.  **Pré-requisitos:**
    * Node.js (versão 18 ou superior)
    * NPM ou Yarn

2.  **Clonagem do Repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/purpura-react-site.git](https://github.com/seu-usuario/purpura-react-site.git)
    ```

3.  **Instalação das Dependências:**
    Navegue até a pasta do projeto e execute o comando:
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

4.  **Execução em Modo de Desenvolvimento:**
    Para iniciar a aplicação, execute:
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

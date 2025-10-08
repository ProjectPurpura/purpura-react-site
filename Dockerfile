# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json* yarn.lock* ./

# Instala as dependências
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# Copia o restante do código
COPY . .

# Gera o build do projeto
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# Etapa 2: Runtime Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Copia os arquivos do build para o Nginx
COPY --from=build /app/build ./

# Configura o Nginx
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
  try_files $uri $uri/ /index.html;
  }

  location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp)$ {
  expires 30d;
  access_log off;
  add_header Cache-Control "public";
  try_files $uri =404;
  }

  error_page 404 /index.html;
}
NGINX

# Expõe a porta 80
EXPOSE 80

# Configura um healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ >/dev/null || exit 1

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]

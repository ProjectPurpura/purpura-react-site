# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; else npm ci; fi
COPY . .
ARG VITE_API_URL
ARG REACT_APP_API_URL
ARG REACT_APP_WEBSOCKET_URL
ENV VITE_API_URL=$VITE_API_URL \
    REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_WEBSOCKET_URL=$REACT_APP_WEBSOCKET_URL
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# Etapa 2: Runtime Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html 2>/dev/null || true
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

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]

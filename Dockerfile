FROM node:20-alpine AS build
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

FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/build /app/build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
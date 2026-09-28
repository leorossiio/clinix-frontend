# Imagem de produção do frontend: build do Angular + nginx.
# O nginx serve os arquivos estáticos e repassa /api para a API (mesma origem,
# sem CORS). O endereço da API vem da variável API_URL (padrão: http://api:3000).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx ng build --configuration docker

FROM nginx:1.30-alpine
ENV API_URL=http://api:3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/clinix/browser /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

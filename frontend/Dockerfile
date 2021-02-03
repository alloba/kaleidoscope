# stage 1

FROM node:alpine AS my-app-build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run build
# stage 2

FROM nginx:alpine
COPY --from=my-app-build /app/dist/kaleidoscope-frontend /usr/share/nginx/html
EXPOSE 80

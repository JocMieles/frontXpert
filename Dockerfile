# Imagen base de Node.js (puedes cambiar a una imagen de Angular si es necesario)
FROM node:18 as node

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json e instalar dependencias
COPY package*.json ./
RUN npm ci --legacy-peer-deps
RUN npm install -g @angular/cli --legacy-peer-deps
RUN npm install  --legacy-peer-deps

# Copiar el resto de los archivos del frontend
COPY . .

RUN npm run build

EXPOSE 80

FROM nginx:latest AS nginx

COPY --from=node ./app/dist/front-xpert/browser /usr/share/nginx/html

# Construir la aplicación para producción

# No se necesita CMD porque Nginx tiene su propio CMD predeterminado

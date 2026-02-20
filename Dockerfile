# 1. Node bauen für React-App
FROM node:20 AS build

WORKDIR /app

# package.json & package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Restliche App kopieren
COPY . .

# React-App bauen
RUN npm run build

# 2. Leichter Webserver für die Build-Dateien
FROM nginx:alpine

# Build-Dateien kopieren in nginx html Verzeichnis
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Nginx Config anpassen, falls SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Standard Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
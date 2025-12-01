FROM node:18-alpine

WORKDIR /app

# Copiamos primero package.json para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Puerto expuesto
EXPOSE 5000

# Usamos nodemon para desarrollo (hot-reload)
CMD ["npm", "run", "dev"]

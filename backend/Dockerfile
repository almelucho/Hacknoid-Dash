# Usa una imagen oficial de Node como base
FROM node:18-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app/backend

# Copia package.json y package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente del backend
COPY . .

# Expone el puerto 5000 (puerto interno de la API)
EXPOSE 5000

# Comando para correr la aplicación
CMD [ "npm", "start" ]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# El host 0.0.0.0 es necesario para que Docker exponga el puerto hacia afuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

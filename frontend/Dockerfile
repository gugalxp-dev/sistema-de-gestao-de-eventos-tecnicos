FROM node:20-bullseye

WORKDIR /app

# Copia tudo de uma vez (inclusive vite.config.js) antes de instalar
COPY package*.json vite.config.js ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

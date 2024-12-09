FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Открываем порт докера, на котором будет работать приложение 
EXPOSE 80

CMD ["npm", "run", "dev", "--", "--host", "--port", "80"]
FROM node:25-alpine3.22

WORKDIR /app

COPY package*.json ./
COPY package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
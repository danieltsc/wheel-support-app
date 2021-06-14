FROM keymetrics/pm2:latest-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["pm2-runtime", "ecosystem.config.js"]
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY lib /app/lib

COPY .env .env

RUN echo "Directory structure after copy:" && ls -R /app/

EXPOSE 4000

CMD ["node", "./lib/services/streamer/cart/consumer.js"]

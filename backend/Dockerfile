FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN cp .env.prod .env

RUN yarn build

EXPOSE 8080

COPY start.sh ./start.sh
RUN chmod +x ./start.sh
CMD ["./start.sh"]
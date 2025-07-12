FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

COPY migration.sh ./migration.sh
RUN chmod +x ./migration.sh
CMD ["node", "dist/main.js"]
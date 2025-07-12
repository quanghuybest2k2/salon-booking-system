#!/bin/sh

yarn migration:generate
yarn migration:run
yarn seed
# start the server
node dist/main.js

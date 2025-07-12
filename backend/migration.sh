#!/bin/sh

# Run default
yarn migration:generate
yarn migration:run

# add suffix --seed to run seed command
if [ "$1" = "--seed" ]; then
  yarn seed
fi
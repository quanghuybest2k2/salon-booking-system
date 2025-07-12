if [ ! -f .env ]; then
    cp .env.development .env
fi

docker compose up -d --build
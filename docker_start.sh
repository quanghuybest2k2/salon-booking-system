#!/bin/bash

if [ "$1" == "--local" ]; then
    if [ ! -f .env ]; then
        echo "📄 Không tìm thấy .env, đang sao chép từ .env.local"
        cp .env.local .env
    fi
    echo "👉 Dùng môi trường local"
    docker compose -f docker-compose.local.yml up -d --build
else
    if [ ! -f .env ]; then
        echo "📄 Không tìm thấy .env, đang sao chép từ .env.development"
        cp .env.development .env
    fi
    echo "🚀 Đang chạy docker compose với cấu hình development"
    docker compose up -d --build
fi
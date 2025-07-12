#!/bin/bash
cp .env.example .env
cd frontend && yarn && cd ..
cd backend && yarn && cd ..
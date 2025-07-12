#!/bin/bash
cd frontend && cp .env.example .env && npm install && cd ..
cd backend && cp .env.example .env && npm install && cd ..
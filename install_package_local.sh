#!/bin/bash
cd frontend && cp .env.example .env && yarn && cd ..
cd backend && cp .env.example .env && yarn && cd ..
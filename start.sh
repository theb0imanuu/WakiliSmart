#!/bin/bash
# start.sh

# 1. Environment check
if [ ! -f backend/.env ]; then
  echo "Error: backend/.env file not found"
  exit 1
fi

cd backend

# 2. Database initialization
npx prisma migrate deploy

# 3. Seed default data (if first run)
if [ ! -f data/wakilismart.db ]; then
  npx prisma db seed
fi

# 4. Start application
npm run start:prod

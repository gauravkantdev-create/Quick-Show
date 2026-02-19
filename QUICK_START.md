# QUICK START COMMANDS

## 1. Fix Clerk Keys First!
Go to: https://dashboard.clerk.com
Get your keys and update:
- server\.env
- client\.env

## 2. Install Everything
cd server && npm install
cd ../client && npm install

## 3. Seed Database
cd server && npm run seed

## 4. Start Backend (Terminal 1)
cd server && npm run server

## 5. Start Frontend (Terminal 2)
cd client && npm run dev

## 6. Open Browser
http://localhost:5173

## Admin Panel
http://localhost:5173/admin

---

## Troubleshooting

### Kill ports if needed:
npx kill-port 3000
npx kill-port 5173

### Reset database:
cd server && npm run seed

### Reinstall dependencies:
rm -rf node_modules package-lock.json
npm install

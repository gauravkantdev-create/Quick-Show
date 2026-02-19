# Quick Show - Movie Ticket Booking System

## 🚀 Setup Instructions

### 1. Fix Clerk Keys (CRITICAL)

Your current Clerk keys are invalid. Follow these steps:

1. Go to https://dashboard.clerk.com
2. Sign in and select your project
3. Navigate to **API Keys** in the sidebar
4. Copy the **Publishable Key** and **Secret Key**
5. Update both `.env` files:

**Server (.env):**
```env
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

**Client (.env):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Setup Database

Make sure MongoDB is running and the connection string in `server/.env` is correct.

### 4. Seed Initial Data

```bash
cd server
npm run seed
```

### 5. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Admin Panel:** http://localhost:5173/admin

## 📁 Project Structure

```
Quick_Show/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Components/    # Reusable components
│   │   ├── Pages/         # Page components
│   │   ├── Lib/           # Utilities & API
│   │   └── assets/        # Static assets
│   └── .env
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── config/           # Database config
│   ├── inngest/          # Inngest functions
│   └── .env
```

## 🔑 API Endpoints

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create show (Auth required)
- `PUT /api/shows/:id` - Update show (Auth required)
- `DELETE /api/shows/:id` - Delete show (Auth required)

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings (Auth required)
- `GET /api/bookings` - Get all bookings (Admin)
- `POST /api/bookings` - Create booking (Auth required)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin)

### Users
- `GET /api/users/me` - Get current user (Auth required)
- `GET /api/users` - Get all users (Admin)

## ⚠️ Troubleshooting

### Clerk Error
If you see "Clerk: Handshake token verification failed":
- Get new keys from https://dashboard.clerk.com
- Make sure keys are complete (no truncation)
- Restart both servers after updating

### Database Connection Error
- Verify MongoDB URI in `server/.env`
- Ensure MongoDB is running
- Check network connectivity

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5173
npx kill-port 5173
```

## 🎯 Features

- ✅ User authentication with Clerk
- ✅ Browse movies and shows
- ✅ Book tickets with seat selection
- ✅ View booking history
- ✅ Admin dashboard
- ✅ Manage shows (Add/Edit/Delete)
- ✅ View all bookings
- ✅ Real-time seat availability

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- React Router
- Clerk Authentication
- Lucide Icons

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Clerk Express
- Inngest

## 📝 Next Steps

1. ✅ Fix Clerk keys (MOST IMPORTANT)
2. ✅ Run `npm install` in both folders
3. ✅ Run `npm run seed` to populate data
4. ✅ Start both servers
5. ✅ Test the application

## 🤝 Support

If you encounter issues:
1. Check all environment variables
2. Verify Clerk keys are valid
3. Ensure MongoDB is connected
4. Check console for errors

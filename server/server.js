import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"
import { inngest, functions } from "./inngest/index.js"
import showRoutes from './routes/showRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

const app = express()
const port = process.env.PORT || 3000

// Connect Database First
const startServer = async () => {
  try {
    await connectDB()

    // Middleware
    app.use(express.json())
    app.use(cors({
      origin: true,
      credentials: true
    }))
    
    // Only use Clerk if keys are properly configured
    if (process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.length > 40) {
      app.use(clerkMiddleware())
      console.log('✅ Clerk middleware enabled')
    } else {
      console.warn('⚠️  Clerk keys not configured properly - running without authentication')
    }

    // API Routes
    app.get("/", (req, res) => {
      res.send("Server is live 🚀")
    })

    app.use('/api/inngest', serve({ client: inngest, functions }))
    app.use('/api/shows', showRoutes)
    app.use('/api/bookings', bookingRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/dashboard', dashboardRoutes)

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server Error:', err)
      res.status(500).json({ error: err.message })
    })

    // Start Server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })

  } catch (error) {
    console.log("Server failed to start:", error.message)
    process.exit(1)
  }
}

startServer()
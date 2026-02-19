import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"
import { inngest, functions } from "./inngest/index.js"

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
    app.use(clerkMiddleware())

    // API Routes
    app.get("/", (req, res) => {
      res.send("Server is live 🚀")
    })

    app.use('/api/inngest', serve({ client: inngest, functions }))

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
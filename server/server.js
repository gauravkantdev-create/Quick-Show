import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"


const app = express();
const port = process.env.PORT || 3000;
app.use(clerkMiddleware())
// Connect Database First
const startServer = async () => {
  try {
    await connectDB();

    // Middleware
    app.use(express.json());
    app.use(cors());

    // API Routes
    app.get("/", (req, res) => {
      res.send("Server is live 🚀");
    });

    app.use('/api/inngest', serve({ client: inngest, functions }));

    // Start Server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.log("Server failed to start:", error.message);
  }
};

startServer();

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import { clerkMiddleware, requireAuth } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

// ROUTES
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import theaterRoutes from "./routes/theaterRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {

    /* -------------------- DB CONNECT -------------------- */

    await connectDB();
    console.log("✅ Database Connected");

    /* -------------------- MIDDLEWARE -------------------- */

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /* -------------------- CORS -------------------- */

    app.use(
      cors({
        origin: [
          "https://quick-show-67ff.vercel.app",
          "http://localhost:5173",
          "http://localhost:5174",
        ],
        credentials: true,
      })
    );

    /* -------------------- TEST ROUTE -------------------- */

    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Server is live 🚀",
      });
    });

    /* -------------------- INNGEST -------------------- */

    app.use(
      "/api/inngest",
      serve({
        client: inngest,
        functions,
      })
    );

    /* -------------------- PUBLIC ROUTES -------------------- */

    app.use("/api/shows", showRoutes);
    app.use("/api/theaters", theaterRoutes);
    app.use("/api/payments", paymentRoutes);

    /* -------------------- CLERK AUTH ONLY AFTER PUBLIC ROUTES -------------------- */

    app.use(clerkMiddleware());
    console.log("🔐 Clerk authentication ENABLED");

    /* -------------------- PROTECTED ROUTES -------------------- */

    app.use("/api/bookings", requireAuth(), bookingRoutes);
    app.use("/api/users", requireAuth(), userRoutes);
    app.use("/api/dashboard", requireAuth(), dashboardRoutes);

    /* -------------------- 404 HANDLER -------------------- */

    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: "Route not found",
      });
    });

    /* -------------------- ERROR HANDLER -------------------- */

    app.use((err, req, res, next) => {
      console.error("Server Error:", err);

      res.status(500).json({
        success: false,
        error: err.message || "Internal Server Error",
      });
    });

    /* -------------------- SERVER START -------------------- */

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.log("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
import mongoose from "mongoose";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let connectionListenersRegistered = false;


const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.MONGO_URI || "";

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.warn(
      "MongoDB URI is missing. Set MONGODB_URI or MONGO_URI to enable database access."
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    if (!connectionListenersRegistered) {
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
      });

      connectionListenersRegistered = true;
    }

    return true;
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.warn("Server will continue without database access.");
    return false;
  }
};

export default connectDB;

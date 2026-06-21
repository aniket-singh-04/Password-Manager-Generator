import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  try {
    // Optional but recommended
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB is not reachable
    });

    console.log("MongoDB connected successfully");

    // Connection event listeners (extra safety/debug)
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from DB");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1); // stop server if DB fails
  }
}
import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI: string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

async function main() {
  try {
    // Database connection attempt
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successful connection to MongoDB.");

    // ... Model definition and logic ...
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

main();

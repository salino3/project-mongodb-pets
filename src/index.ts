import mongoose, { model } from "mongoose";
import "dotenv/config";
import express from "express";
import { OwnerSchema } from "./models/owner.js";
import type { IOwner } from "./models/owner.js";
import { PetSchema } from "./models/pet.js";
import type { IPet } from "./models/pet.js";
import ownerRoutes from "./routes/owner.routes.js";
import petRoutes from "./routes/pet.routes.js";

const MONGODB_URI: string = process.env.MONGODB_URI!;
const PORT = process.env.PORT || 3000;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

const app = express();

async function main() {
  try {
    // 1. Database connection attempt
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successful connection to MongoDB.");

    model<IOwner>("Owner", OwnerSchema);
    model<IPet>("Pet", PetSchema);

    app.use(express.json());

    app.use("/api/owners", ownerRoutes);
    app.use("/api/pets", petRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

    console.log("❌ Connection to MongoDB closed.");
  } catch (error) {
    console.error("❌ Execution error:", error);
  }
}

main();

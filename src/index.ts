import mongoose, { model } from "mongoose";
import "dotenv/config";
import { OwnerSchema } from "./models/owner.js";
import type { IOwner } from "./models/owner.js";
import type { IPet } from "./models/pet.js";
import { PetSchema } from "./models/pet.js";

const MONGODB_URI: string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

async function main() {
  try {
    // 1. Database connection attempt
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successful connection to MongoDB.");

    const Owner = model<IOwner>("Owner", OwnerSchema);
    const Pet = model<IPet>("Pet", PetSchema);

    // Close connection after the operation
    await mongoose.disconnect();
    console.log("❌ Connection to MongoDB closed.");
  } catch (error) {
    console.error("❌ Execution error:", error);
  }
}

main();

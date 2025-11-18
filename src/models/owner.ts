import { Schema, Document } from "mongoose";

// Interface for type checking in TypeScript
// Extends Document to include Mongoose properties like _id
export interface IOwner extends Document {
  name: string;
  phone?: string;
  address?: string;
}

// Define the Mongoose Schema. It's the blueprint.
const OwnerSchema = new Schema<IOwner>({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from the ends of a string
  },
  phone: String,
  address: String,
});

// The Model will be created in index.ts after connection.
export { OwnerSchema };

import { Schema, Document, Types } from "mongoose";

// Interface for type checking in TypeScript
export interface IPet extends Document {
  name: string;
  species: string;
  birthDate?: Date;
  ownerId: Types.ObjectId;
}

// Define the Mongoose Schema
export const PetSchema = new Schema<IPet>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  species: {
    type: String,
    required: true,
  },
  birthDate: Date,

  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
});

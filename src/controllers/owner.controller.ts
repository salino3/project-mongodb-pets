import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { IOwner } from "../models/owner.js";

// Function to safely get the model AFTER it is registered
const getOwnerModel = () => mongoose.model<IOwner>("Owner");

export const createOwner = async (req: Request, res: Response) => {
  try {
    const OwnerModel = getOwnerModel();

    const { name, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const owner = await OwnerModel.create({ name, phone, address });
    res.status(201).json({ message: "Owner created", owner });
  } catch (error: any) {
    console.error("createOwner error:", error);
    res.status(500).json({ message: error.message });
  }
};

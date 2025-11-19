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

export const getOwnerById = async (req: Request, res: Response) => {
  try {
    const OwnerModel = getOwnerModel();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Owner ID is missing." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }

    const owner = await OwnerModel.findById(id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found." });
    }

    res.status(200).json(owner);
  } catch (error: any) {
    console.error("getOwnerById error:", error);
    res.status(500).json({ message: error.message });
  }
};

import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import type { IPet } from "../models/pet.js";
import type { IOwner } from "../models/owner.js";

// Function to safely get the Mongoose Models
const getPetModel = () => mongoose.model<IPet>("Pet");
const getOwnerModel = () => mongoose.model<IOwner>("Owner");

/**
 * @route POST /api/pets
 * @desc Creates a new pet and links it to an owner via ownerId.
 */
export const createPet = async (req: Request, res: Response) => {
  try {
    const PetModel = getPetModel();
    const OwnerModel = getOwnerModel();
    const { name, species, ownerId, birthDate } = req.body;

    // 1. Basic Validation
    if (!name || !species || !ownerId) {
      return res
        .status(400)
        .json({ message: "Name, species, and ownerId are required." });
    }

    // 2. Foreign Key Check (Optional but recommended for integrity)
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }
    const ownerExists = await OwnerModel.findById(ownerId);
    if (!ownerExists) {
      // If the referenced owner does not exist
      return res.status(404).json({
        message: `Owner with ID ${ownerId} not found. Cannot create pet.`,
      });
    }

    // 3. Create and save the new pet document
    const pet = await PetModel.create({ name, species, ownerId, birthDate });

    res.status(201).json({ message: "Pet created successfully.", pet });
  } catch (error: any) {
    console.error("createPet error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/pets/:id
 * @desc Retrieves a single pet by their ID and POPULATES the owner details.
 */
export const getPetById = async (req: Request, res: Response) => {
  try {
    const PetModel = getPetModel();
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pet ID." });
    }

    // KEY FUNCTIONALITY: Find the pet and replace the ownerId field
    // with the actual owner document data (Mongoose JOIN).
    const pet = await PetModel.findById(id).populate("ownerId");

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    res.status(200).json(pet);
  } catch (error: any) {
    console.error("getPetById error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route PUT /api/pets/:id
 * @desc Updates an existing pet by ID.
 */
export const updatePet = async (req: Request, res: Response) => {
  try {
    const PetModel = getPetModel();
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pet ID." });
    }

    // Note: If updateData contains ownerId, Mongoose will try to update it.
    const pet = await PetModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found to update." });
    }

    res.status(200).json({ message: "Pet updated successfully.", pet });
  } catch (error: any) {
    console.error("updatePet error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route DELETE /api/pets/:id
 * @desc Deletes a pet by ID.
 */
export const deletePet = async (req: Request, res: Response) => {
  try {
    const PetModel = getPetModel();
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pet ID." });
    }

    const result = await PetModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Pet not found to delete." });
    }

    res.status(200).json({ message: "Pet deleted successfully." });
  } catch (error: any) {
    console.error("deletePet error:", error);
    res.status(500).json({ message: error.message });
  }
};

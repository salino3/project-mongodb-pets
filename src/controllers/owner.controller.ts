import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { IOwner } from "../models/owner.js";
import type { IPet } from "../models/pet.js";

// Function to safely get the model AFTER it is registered
const getOwnerModel = () => mongoose.model<IOwner>("Owner");
// Function to safely get the Pet Model
const getPetModel = () => mongoose.model<IPet>("Pet");

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

//
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

//
export const updateOwner = async (req: Request, res: Response) => {
  try {
    const OwnerModel = getOwnerModel();
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Owner ID is missing." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }

    const owner = await OwnerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found to update." });
    }

    res.status(200).json({ message: "Owner updated successfully.", owner });
  } catch (error: any) {
    console.error("updateOwner error:", error);
    res.status(500).json({ message: error.message });
  }
};

//
export const deleteOwner = async (req: Request, res: Response) => {
  try {
    const OwnerModel = getOwnerModel();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Owner ID is missing." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }

    const result = await OwnerModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Owner not found to delete." });
    }

    res.status(200).json({ message: "Owner deleted successfully." });
  } catch (error: any) {
    console.error("deleteOwner error:", error);
    res.status(500).json({ message: error.message });
  }
};

//
export const getAllPetsByOwnerId = async (req: Request, res: Response) => {
  try {
    const OwnerModel = getOwnerModel();
    const PetModel = getPetModel();
    const { ownerId } = req.params;

    // 1. Validate Owner ID format
    if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }

    // 2. Check if the Owner exists
    const ownerExists = await OwnerModel.findById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({ message: "Owner not found." });
    }

    // 3. Find all pets where the 'ownerId' field matches the ID from the URL.
    // NOTE: We don't need .populate() here unless the Pet model had its own references.
    const pets = await PetModel.find({ ownerId: ownerId });

    // 4. Return the list of pets
    res.status(200).json({
      message: `Pets found for owner: ${ownerExists.name}`,
      petsCount: pets.length,
      pets: pets,
    });
  } catch (error: any) {
    console.error("getAllPetsByOwnerId error:", error);
    res.status(500).json({ message: error.message });
  }
};

//
export const getAllPetsByOwnerIdWithLookUp = async (
  req: Request,
  res: Response
) => {
  try {
    const OwnerModel = getOwnerModel();
    const { ownerId } = req.params;

    // 1. Validate Owner ID format
    if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID format." });
    }

    // Convert the string ID from req.params to a Mongoose ObjectId
    // This is required for the $match stage in the aggregation pipeline.
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    // 2. SINGLE DB CALL: The Aggregation Pipeline
    const results = await OwnerModel.aggregate([
      // $match: Stage 1. Filter the 'owners' collection to find the specific owner.
      // If the owner does not exist, the pipeline returns an empty array,
      // which we use to trigger the 404 response.
      { $match: { _id: ownerObjectId } },

      // $lookup: Stage 2. Perform the JOIN operation (left outer join).
      {
        $lookup: {
          from: "pets", // The collection we want to join with (must be the plural name)
          localField: "_id", // The field from the input documents (Owner's _id)
          foreignField: "ownerId", // The field from the 'pets' collection to match on
          as: "pets", // The name of the new array field to add to the output documents
        },
      },

      // $project: Stage 3 (Optional). Shape the output document for the client.
      {
        $project: {
          name: 1, // Keep the owner's name
          pets: 1, // Keep the array of pets
          _id: 0, // Hide the owner's _id from the final output (optional cleanup)
        },
      },
    ]);

    // 3. Check if the Owner was found (Validation check based on pipeline result)
    if (results.length === 0) {
      // If the $match stage failed, the array will be empty.
      return res.status(404).json({ message: "Owner not found." });
    }

    // 4. Extract data and send the response
    const ownerData = results[0];
    const pets = ownerData.pets || [];

    res.status(200).json({
      message: `Pets found for owner: ${ownerData.name}`,
      petsCount: pets.length,
      pets: pets,
    });
  } catch (error: any) {
    console.error("getAllPetsByOwnerId aggregation error:", error);
    res.status(500).json({ message: error.message });
  }
};

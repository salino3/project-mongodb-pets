import { Router } from "express";
import {
  createOwner,
  deleteOwner,
  getAllPetsByOwnerId,
  getAllPetsByOwnerIdWithLookUp,
  getOwnerById,
  updateOwner,
} from "../controllers/owner.controller.js";

const router = Router();

router.post("/", createOwner);

router
  .route("/:id")
  // .all(middlewareExample)
  .get(getOwnerById)
  .put(updateOwner)
  .delete(
    // middlewareExample
    deleteOwner
  );

router.get("/:ownerId/pets", getAllPetsByOwnerId);

router.get("/:ownerId/pets/lookup", getAllPetsByOwnerIdWithLookUp);

export default router;

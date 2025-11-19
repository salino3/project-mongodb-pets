import { Router } from "express";
import {
  createOwner,
  deleteOwner,
  getAllPetsByOwnerId,
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

export default router;

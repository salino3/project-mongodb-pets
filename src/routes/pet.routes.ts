import { Router } from "express";
import * as petController from "../controllers/pet.controller.js";

const router = Router();

router.post("/", petController.createPet);

router
  .route("/:id")
  .get(petController.getPetById)
  .put(petController.updatePet)
  .delete(petController.deletePet);

export default router;

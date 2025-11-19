import { Router } from "express";
import {
  createOwner,
  deleteOwner,
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

export default router;

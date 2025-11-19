import { Router } from "express";
import {
  createOwner,
  deleteOwner,
  getOwnerById,
  updateOwner,
} from "../controllers/owner.controller.js";

const router = Router();

router.post("/", createOwner);

router.route("/:id").get(getOwnerById).put(updateOwner).delete(deleteOwner);

export default router;

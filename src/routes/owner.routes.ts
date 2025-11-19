import { Router } from "express";
import { createOwner, getOwnerById } from "../controllers/owner.controller.js";

const router = Router();

router.post("/", createOwner);

router.get("/:id", getOwnerById);

export default router;

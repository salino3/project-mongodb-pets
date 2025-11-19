import { Router } from "express";
import { createOwner } from "../controllers/owner.controller.js";

const router = Router();

router.post("/", createOwner);

export default router;

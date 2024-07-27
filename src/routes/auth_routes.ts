import express from "express";
const router = express.Router();
import { googleSignin, register } from "../controllers/auth_controller";

router.post("/google", googleSignin);
router.post("/register", register);

export default router;
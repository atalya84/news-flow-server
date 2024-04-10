import express from "express";
const router = express.Router();
import { googleSignin } from "../controllers/auth_controller";

router.post("/google", googleSignin);

export default router;
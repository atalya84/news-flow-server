import express from "express";
const router = express.Router();
import { googleSignin, register, login, refresh } from "../controllers/auth_controller";

router.post("/google", googleSignin);
router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);

export default router;
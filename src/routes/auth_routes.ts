import express from "express";
const router = express.Router();
import { googleSignin, register } from "../controllers/auth_controller";
import { upload } from "../common/file_upload";

router.post("/google", googleSignin);

/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", upload.array("image"), register);

export default router;
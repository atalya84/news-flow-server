import express from 'express';
const router = express.Router();
import {
	googleSignin,
	login,
	logout,
	refresh,
	register,
} from '../controllers/auth_controller';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *        - email
 *        - name
 *        - password
 *        - imgUrl
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *         name:
 *           type: string
 *           description: User name
 *         imgUrl:
 *           type: string
 *           description: User image URL
 *       example:
 *         email: "user@mail.com"
 *         name: "UserName"
 *         password: ""
 *         imgUrl: "http://localhost:4000/profiles/profile_1722434622635.jpg"
 *     LoginUser:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         email: "user@mail.com"
 *         password: ""
 */

/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user with google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - credential
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loggen in via google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Unable to log in via google
 *       500:
 *         description: Internal error occured
 */
router.post('/google', googleSignin);

/**
 * @swagger
 * /auth/register/:
 *   post:
 *     tags: [Auth]
 *     summary: Registers a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Registered user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal error occured
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login/:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       201:
 *         description: Logged in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal error occured
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh/:
 *   get:
 *     summary: Get a new access token using the refresh token
 *     tags: [Auth]
 *     description: Need to provide the refresh token in request header 'refresh_token'
 *     responses:
 *       200:
 *         description: Got new token
 *         content:
 *           application/json:
 *             schema:
 *               type: Array<string>
 *       400:
 *         description: Error getting tokens
 *       401:
 *         description: Unauthorized
 */
router.get('/refresh', refresh);

/**
 * @swagger
 * /auth/logout/:
 *   get:
 *     summary: Log out user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out user
 *       400:
 *         description: Unable to log out user
 *       401:
 *         description: Unauthorized
 *
 */
router.get('/logout', logout);

export default router;

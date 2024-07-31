import { Router } from 'express';
import userController from '../controllers/user.controller';
import postController from '../controllers/post.controller';
import { authMiddleware } from '../controllers/auth_controller';

const userRouter: Router = Router();
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The Users API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
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
 *         tokens:
 *           type: Array<string>
 *           description: User tokens
 *     User:
 *       type: object
 *       required:
 *        - email
 *        - name
 *        - _id
 *        - password
 *        - imgUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
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
 *         tokens:
 *           type: Array<string>
 *           description: User tokens
 *       example:
 *         _id: '66aa443e5c595d908ea9e671'
 *         email: "user@mail.com"
 *         name: "UserName"
 *         password: ""
 *         imgUrl: "http://localhost:4000/profiles/profile_1722434622635.jpg"
 *         tokens: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjI2ODRkMmUxYTZmMmM3OGU2NjBhYmQiLCJpYXQiOjE3MTM4MDA0MDJ9.ZQXF7lHaUek1zO6dIMyemvd3XovlV_l61j3N5LuHamg"]
 */

/**
 * @swagger
 * /users/self/:
 *   get:
 *     summary: Get current connected user
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal error occured
 */
userRouter.get(
	'/self',
	authMiddleware,
	userController.getSelf.bind(userController)
);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal error occured
 */
userRouter.get('/', authMiddleware, userController.getAll.bind(userController));

/**
 * @swagger
 * /users/:id/:
 *   get:
 *     summary: Get user
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Internal error occured
 */
userRouter.get('/:id', authMiddleware, userController.get.bind(userController));

/**
 * @swagger
 * /users/:id/:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       406:
 *         description: Unable to update user
 *       500:
 *         description: Internal error occured
 */
userRouter.put('/:id', authMiddleware, userController.put.bind(userController));

/**
 * @swagger
 * /users/:id/:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       406:
 *         description: Unable to delete user
 *       500:
 *         description: Internal error occured
 */
userRouter.delete(
	'/:id',
	authMiddleware,
	userController.delete.bind(userController)
);

/**
 * @swagger
 * /users/:id/posts/:
 *   get:
 *     summary: Get user posts
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
userRouter.get(
	'/:id/posts',
	authMiddleware,
	postController.getUserPosts.bind(postController)
);

export default userRouter;

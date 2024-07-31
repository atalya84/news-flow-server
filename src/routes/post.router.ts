import { Router } from 'express';
import postController from '../controllers/post.controller';
import { authMiddleware } from '../controllers/auth_controller';

const postRouter: Router = Router();
/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: The Posts API
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *        - text
 *        - userId
 *        - created
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *         userId:
 *           type: string
 *           description: ID of comment creator
 *         created:
 *           type: date
 *           description: Comment creation date
 *     CommentInput:
 *       type: object
 *       required:
 *        - text
 *        - userId
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *         userId:
 *           type: string
 *           description: ID of comment creator
 *         created:
 *           type: date
 *           description: Comment creation date
 *     Post:
 *       type: object
 *       required:
 *        - title
 *        - source
 *        - country
 *        - imgUrl
 *        - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Post ID
 *         title:
 *           type: string
 *           description: Post title
 *         source:
 *           type: string
 *           description: Article link URL
 *         country:
 *           type: string
 *           description: Article country
 *         imgUrl:
 *           type: string
 *           description: Post image Url
 *         userId:
 *           type: string
 *           description: ID of post creator
 *         body:
 *           type: string
 *           description: Post body
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Post comments
 *         created:
 *           type: date
 *           description: Post creation date
 *     PostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Post title
 *         source:
 *           type: string
 *           description: Article link URL
 *         country:
 *           type: string
 *           description: Article country
 *         imgUrl:
 *           type: string
 *           description: Post image Url
 *         userId:
 *           type: string
 *           description: ID of post creator
 *         body:
 *           type: string
 *           description: Post body
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Post comments
 *         created:
 *           type: date
 *           description: Post creation date
 *       example:
 *         _id: '66a2aa3be73a473231f52588'
 *         title: 'Post Title'
 *         source: 'https://ynet.co.il'
 *         country: 'Israel'
 *         imgUrl: 'http://hostname/posts/image.jpg'
 *         userId: '662684d2e1a6f2c78e660abd'
 *         body: ''
 *         comments: [{
 *          userId: '662684d2e1a6f2c78e660abd',
 *          created: '2024-07-25T19:30:43.974Z',
 *          text: 'comment text'
 *         }]
 *         created: '2024-07-25T19:30:43.974Z'
 */

/**
 * @swagger
 * /posts/:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.get('/', authMiddleware, postController.getAll.bind(postController));

/**
 * @swagger
 * /posts/:id:
 *   get:
 *     summary: Get post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Got posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.get('/:id', authMiddleware, postController.get.bind(postController));

/**
 * @swagger
 * /posts/:id:
 *   post:
 *     summary: Create post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.post('/', authMiddleware, postController.post.bind(postController));

/**
 * @swagger
 * /posts/:id:
 *   put:
 *     summary: Update post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.put('/:id', authMiddleware, postController.put.bind(postController));

/**
 * @swagger
 * /posts/:id:
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.delete(
	'/:id',
	authMiddleware,
	postController.delete.bind(postController)
);

/**
 * @swagger
 * /posts/:id/comments:
 *   post:
 *     summary: Create comment on post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: Created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal error occured
 */
postRouter.post(
	'/:id/comments',
	authMiddleware,
	postController.createComment.bind(postController)
);

export default postRouter;

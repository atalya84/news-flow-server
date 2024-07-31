import express from 'express';
import { createUpload } from '../controllers/file_controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: The Files API
 */

/**
 * @swagger
 * /files/uploadProfile:
 *   post:
 *     summary: Upload a profile image
 *     tags: [Files]
 *     produces: application/json
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: Uploaded profile image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - imgUrl
 *               properties:
 *                 imgUrl:
 *                   type: string
 *                   description: Profile image URL
 *       400:
 *         description: Unable to upload file
 */
const uploadToProfiles = createUpload('profiles/');
router.post('/uploadProfile', uploadToProfiles.array('file'), (req, res) => {
	if (!req.body.imgUrl) {
		return res.status(400).send('No file uploaded.');
	}
	res.status(200).send({ imgUrl: req.body.imgUrl });
});

/**
 * @swagger
 * /files/uploadPost:
 *   post:
 *     summary: Upload a post image
 *     tags: [Files]
 *     produces: application/json
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: Uploaded post image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - imgUrl
 *               properties:
 *                 imgUrl:
 *                   type: string
 *                   description: Post image URL
 *       400:
 *         description: Unable to upload file
 */
const uploadToPosts = createUpload('posts/');
router.post('/uploadPost', uploadToPosts.single('file'), (req, res) => {
	if (!req.body.imgUrl) {
		return res.status(400).send('No file uploaded.');
	}
	res.status(200).send({ imgUrl: req.body.imgUrl });
});

export default router;


import express from "express";
import { createUpload } from "../controllers/file_controller";

const router = express.Router();

const uploadToProfiles = createUpload('profiles/');
router.post('/uploadProfile', uploadToProfiles.array("file"), (req, res) => {
    if (!req.body.imgUrl) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ imgUrl: req.body.imgUrl});
});


const uploadToPosts = createUpload('posts/');
router.post('/uploadPost', uploadToPosts.single("file"), (req, res) => {
    if (!req.body.imgUrl) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ imgUrl: req.body.imgUrl});
});

export default router;
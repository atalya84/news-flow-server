import { Router } from 'express';
import postController from '../controllers/post.controller';
import commentController from '../controllers/comment.controller';

const userRouter = Router();

userRouter.get('/:id');
userRouter.get(
	'/:id/posts',
	postController.getPostsByUserId.bind(postController)
);
userRouter.get(
	'/:id/comments',
	commentController.getCommentsByUserId.bind(commentController)
);
export default userRouter;

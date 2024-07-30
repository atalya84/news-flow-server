import { Router } from 'express';
import postController from '../controllers/post.controller';
import { authMiddleware } from '../controllers/auth_controller';

const postRouter: Router = Router();

postRouter.get('/', authMiddleware, postController.getAll.bind(postController));
postRouter.get('/:id', authMiddleware, postController.get.bind(postController));
postRouter.post('/', authMiddleware, postController.post.bind(postController));
postRouter.put('/:id', authMiddleware, postController.put.bind(postController));
postRouter.delete(
	'/:id',
	authMiddleware,
	postController.delete.bind(postController)
);
postRouter.post(
	'/:id/comments',
	authMiddleware,
	postController.createComment.bind(postController)
);

export default postRouter;

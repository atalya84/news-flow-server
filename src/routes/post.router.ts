import { Router } from 'express';
import postController from '../controllers/post.controller';

const postRouter: Router = Router();

postRouter.get('/', postController.getAll.bind(postController));
postRouter.get('/:id', postController.get.bind(postController));
postRouter.post('/', postController.post.bind(postController));
postRouter.put('/:id', postController.put.bind(postController));
postRouter.delete('/:id', postController.delete.bind(postController));
postRouter.post(
	'/:id/comments',
	postController.createComment.bind(postController)
);

export default postRouter;

import { Router } from 'express';
import postController from '../controllers/post.controller';
import commentController from '../controllers/comment.controller';

const postRouter: Router = Router();

postRouter.get('/', postController.getAll.bind(postController));
postRouter.get('/:id', postController.get.bind(postController));
postRouter.post('/', postController.post.bind(postController));
postRouter.put('/:id', postController.put.bind(postController));
postRouter.delete('/:id', postController.delete.bind(postController));
postRouter.get(
	'/:id/comments',
	commentController.getCommentsByPostId.bind(commentController)
);
postRouter.get(
	'/range/:date',
	postController.getPostsByDate.bind(postController)
);
export default postRouter;

import { Router } from 'express';
import commentController from '../controllers/comment.controller';

const commentRouter: Router = Router();

commentRouter.get('/', commentController.getAll.bind(commentController));
commentRouter.get('/:id', commentController.get.bind(commentController));
commentRouter.post('/', commentController.post.bind(commentController));
commentRouter.put('/:id', commentController.put.bind(commentController));
commentRouter.delete('/:id', commentController.delete.bind(commentController));
commentRouter.get(
	'/range/:date',
	commentController.getCommentsByDate.bind(commentController)
);

export default commentRouter;

import { Router } from 'express';
import userController from '../controllers/user.controller';
import postController from '../controllers/post.controller';
import { authMiddleware } from '../controllers/auth_controller';

const userRouter: Router = Router();

userRouter.get(
	'/self',
	authMiddleware,
	userController.getSelf.bind(userController)
);
userRouter.get('/', authMiddleware, userController.getAll.bind(userController));
userRouter.get('/:id', authMiddleware, userController.get.bind(userController));
userRouter.put('/:id', authMiddleware, userController.put.bind(userController));
userRouter.put('/:id', authMiddleware, userController.put.bind(userController));
userRouter.delete(
	'/:id',
	authMiddleware,
	userController.delete.bind(userController)
);
userRouter.get(
	'/:id/posts',
	authMiddleware,
	postController.getUserPosts.bind(postController)
);

export default userRouter;

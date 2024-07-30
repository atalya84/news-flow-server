import { Router } from 'express';
import userController from '../controllers/user.controller';
import postController from '../controllers/post.controller';

const userRouter: Router = Router();

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.get.bind(userController));
userRouter.delete('/:id', userController.delete.bind(userController));
userRouter.get('/:id/posts', postController.getUserPosts.bind(postController));

export default userRouter;

import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter: Router = Router();

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.get.bind(userController));
userRouter.delete('/:id', userController.delete.bind(userController));

export default userRouter;

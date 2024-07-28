import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../controllers/auth_controller';

const userRouter: Router = Router();

userRouter.get("/self", authMiddleware, userController.getSelf.bind(userController));

export default userRouter;
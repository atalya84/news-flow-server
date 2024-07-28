import UserModel, { IUser } from "../models/user_model";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import { AuthRequest } from "./auth_controller";

class UserController extends BaseController<IUser> {
    async getSelf(req: AuthRequest, res: Response) {
        try {
            const user = await this.model.findById(req.user._id);
            res.send({ user });
        } catch (err) {
            console.log("heelo darknes")
            res.status(500).json({ message: err.message });
        }
    }
}

const userController = new UserController(UserModel);

export default userController
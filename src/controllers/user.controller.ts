import { Request, Response } from 'express';
import userModel, { IUser } from '../models/user_model';
import { BaseController } from './base.controller';
import { AuthRequest } from './auth_controller';

class UserController extends BaseController<IUser> {
	constructor() {
		super(userModel);
	}
	async getSelf(req: AuthRequest, res: Response) {
		try {
			const user = await this.model.findById(req.user._id);
			res.send({ user });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const users = (await this.model.find()).map(removePrivateData);
		res.send(users);
	}
	async get(req: Request, res: Response): Promise<void> {
		const user = removePrivateData(
			await this.model.findById(req.params.id)
		);
		res.send(user);
	}
	async delete(req: Request, res: Response): Promise<void> {
		super.delete(req, res);
	}
}

const removePrivateData = (user: IUser): Omit<IUser, 'password'> => ({
	_id: user._id,
	name: user.name,
	email: user.email,
	imgUrl: user.imgUrl,
	tokens: user.tokens,
});

export default new UserController();

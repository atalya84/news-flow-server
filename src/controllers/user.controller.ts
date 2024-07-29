import { Request, Response } from 'express';
import userModel, { IUser } from '../models/user_model';
import { BaseController } from './base.controller';

class UserController extends BaseController<IUser> {
	constructor() {
		super(userModel);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const users = (await this.model.find()).map(removePrivateData);
		console.log('Retrieving users:', users);
		res.send(users);
	}
	async get(req: Request, res: Response): Promise<void> {
		const user = removePrivateData(
			await this.model.findById(req.params.id)
		);
		console.log('Retrieving user:', user);
		res.send(user);
	}
	async delete(req: Request, res: Response): Promise<void> {
		super.delete(req, res);
	}
}

const removePrivateData = (
	user: IUser
): Omit<IUser, 'password' | 'refreshTokens' | 'lastName'> => ({
	_id: user._id,
	name: user.name,
	email: user.email,
	imgUrl: user.imgUrl,
});

export default new UserController();

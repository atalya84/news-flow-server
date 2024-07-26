import { Request, Response } from 'express';
import userModel, { IUser } from '../models/user_model';
import { BaseController } from './base.controller';

class PostController extends BaseController<IUser> {
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
	async post(req: Request, res: Response): Promise<void> {
		super.post(req, res);
	}
	async put(req: Request, res: Response): Promise<void> {
		super.put(req, res);
	}
	async delete(req: Request, res: Response): Promise<void> {
		super.post(req, res);
	}
}

const removePrivateData = (
	user: IUser
): Omit<IUser, 'password' | 'refreshTokens'> => ({
	_id: user._id,
	name: user.name,
	lastName: user.lastName,
	email: user.email,
	imgUrl: user.imgUrl,
});

export default new PostController();

import { Request, Response } from 'express';
import postModel, { IPost } from '../models/post.model';
import { BaseController } from './base.controller';

class PostController extends BaseController<IPost> {
	constructor() {
		super(postModel);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		super.getAll(req, res);
	}
	async get(req: Request, res: Response): Promise<void> {
		super.get(req, res);
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

export default new PostController();

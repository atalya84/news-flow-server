import { Request, Response } from 'express';
import { IPost } from '../models/post.model';
import postModel from '../models/post.model';
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
		req.body.created = new Date();
		super.post(req, res);
	}
	async put(req: Request, res: Response): Promise<void> {
		super.put(req, res);
	}
	async delete(req: Request, res: Response): Promise<void> {
		super.delete(req, res);
	}
	async getPostsByUserId(req: Request, res: Response): Promise<void> {
		try {
			const userId: string = req.params.id;
			const userPosts: IPost[] = await postModel.find({ userId });
			res.status(200).json(userPosts);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}
	async getPostsByDate(req: Request, res: Response): Promise<void> {
		try {
			const range: Date = new Date(req.params.date);
			const posts: IPost[] = await postModel.find({
				created: { $gte: range },
			});
			res.status(200).json(posts);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}
}

export default new PostController();

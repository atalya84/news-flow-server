import { Request, Response } from 'express';
import { IComment } from '../models/comment.model';
import commentModel from '../models/comment.model';
import { BaseController } from './base.controller';

class CommentController extends BaseController<IComment> {
	constructor() {
		super(commentModel);
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
	async getCommentsByUserId(req: Request, res: Response): Promise<void> {
		try {
			const userId: string = req.params.id;
			const userComments: IComment[] = await commentModel.find({
				userId,
			});
			res.status(200).json(userComments);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}
	async getCommentsByPostId(req: Request, res: Response): Promise<void> {
		try {
			const postId: string = req.params.id;
			const userComments: IComment[] = await commentModel.find({
				postId,
			});
			res.status(200).json(userComments);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}
	async getCommentsByDate(req: Request, res: Response): Promise<void> {
		try {
			const range: Date = new Date(req.params.date);
			const comments: IComment[] = await commentModel.find({
				created: { $gte: range },
			});
			res.status(200).json(comments);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}
}

export default new CommentController();

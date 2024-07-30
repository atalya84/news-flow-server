import { Request, Response } from 'express';
import postModel, { IPost } from '../models/post.model';
import { BaseController } from './base.controller';
import { IComment } from '../models/comment.model';

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
	async getUserPosts(req: Request, res: Response): Promise<void> {
		try {
			const result = await postModel
				.find({ userId: req.params.id })
				.exec();
			res.status(200).send(result);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(406).send(
				'Could not update the requested object: ' + err.message
			);
		}
	}
	async createComment(req: Request, res: Response) {
		try {
			req.body.created = new Date();
			const result = await postModel
				.findByIdAndUpdate(
					req.params.id,
					{
						$push: { comments: req.body },
					},
					{ returnOriginal: false }
				)
				.exec();
			res.status(201).send(result);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(406).send(
				'Could not update the requested object: ' + err.message
			);
		}
	}
}

export default new PostController();

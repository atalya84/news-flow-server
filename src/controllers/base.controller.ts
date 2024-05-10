import { Request, Response } from 'express';
import { Model } from 'mongoose';

export class BaseController<ModelType> {
	model: Model<ModelType>;
	constructor(model: Model<ModelType>) {
		this.model = model;
	}

	async getAll(req: Request, res: Response) {
		try {
			const items = await this.model.find();
			res.send(items);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}

	async get(req: Request, res: Response) {
		try {
			const items = await this.model.findById(req.params.id);
			res.send(items);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(500).json({ message: err.message });
		}
	}

	async post(req: Request, res: Response) {
		try {
			const obj = await this.model.create(req.body);
			res.status(201).send(obj);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(406).send('Error: ' + err.message);
		}
	}

	async put(req: Request, res: Response) {
		try {
			const result = await this.model
				.findByIdAndUpdate(req.params.id, req.body, {
					returnOriginal: false,
				})
				.exec();
			res.status(201).send(result);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(406).send(
				'Could not update the requested object: ' + err.message
			);
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const result = await this.model
				.findByIdAndDelete(req.params.id)
				.exec();
			res.status(201).send(result);
		} catch (err) {
			console.error('Error: ', err.message);
			res.status(406).send(
				'Could not delete the requested object: ' + err.message
			);
		}
	}
}

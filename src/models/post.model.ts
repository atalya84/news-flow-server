import { Schema, model } from 'mongoose';
import { IComment } from './comment.model';
import { commentSchema } from './comment.model';

export interface IPost {
	title: string;
	source: string;
	country: string;
	imgUrl: string;
	comments: IComment[];
	userId: string;
	created: Date;
	body?: string;
}

const postSchema = new Schema<IPost>({
	title: { type: String, required: true },
	source: { type: String, required: true },
	country: { type: String, required: true },
	userId: { type: String, required: true },
	created: { type: Date, required: true },
	comments: [commentSchema],
	body: String,
	imgUrl: String,
});

export default model<IPost>('Post', postSchema);

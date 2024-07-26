import { Schema, model } from 'mongoose';
import { IComment } from './comment.model';
import { commentSchema } from './comment.model';

export interface IPost {
	title: string;
	source: string;
	country: string;
	body: string;
	imgUrl: string;
	comments: IComment[];
	userId: string;
}

const postSchema = new Schema<IPost>({
	title: { type: String, required: true },
	userId: { type: String, required: true },
	comments: [commentSchema],
	imgUrl: String,
});

export default model<IPost>('Post', postSchema);

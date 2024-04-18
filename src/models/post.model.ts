import { Schema, model } from 'mongoose';
import { IComment } from './comment.model';
import { commentSchema } from './comment.model';

export interface IPost {
	title: string;
	image: string;
	comments: IComment[];
	owner: string;
}

const postSchema = new Schema<IPost>({
	title: { type: String, required: true },
	owner: { type: String, required: true },
	comments: [commentSchema],
	image: String,
});

export default model<IPost>('Post', postSchema);

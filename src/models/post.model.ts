import { Schema, model } from 'mongoose';

export interface IPost {
	_id: string;
	title: string;
	image: string;
	userId: string;
	created: Date;
}

const postSchema = new Schema<IPost>({
	title: { type: String, required: true },
	userId: { type: String, required: true },
	image: String,
	created: { type: Date, required: true },
});

export default model<IPost>('Post', postSchema);

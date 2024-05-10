import { Schema, model } from 'mongoose';

export interface IComment {
	postId: string;
	userId: string;
	text: string;
	created: Date;
}

export const commentSchema = new Schema<IComment>({
	postId: { type: String, required: true },
	userId: { type: String, required: true },
	text: { type: String, required: true },
	created: { type: Date, required: true },
});

export default model<IComment>('Comment', commentSchema);

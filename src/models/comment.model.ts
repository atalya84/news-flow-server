import { Schema } from 'mongoose';

export interface IComment {
	text: string;
	userId: string;
	created: Date;
}

export const commentSchema = new Schema<IComment>({
	userId: { type: String, required: true },
	text: { type: String, required: true },
	created: { type: Date, required: true },
});

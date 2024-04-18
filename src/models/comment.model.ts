import { Schema, model } from 'mongoose';

export interface IComment {
	text: string;
	owner: string;
}

export const commentSchema = new Schema<IComment>({
	text: { type: String, required: true },
	owner: { type: String, required: true },
});

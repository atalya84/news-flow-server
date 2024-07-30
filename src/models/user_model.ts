import mongoose from 'mongoose';

export interface IUser {
	_id?: string;
	email: string;
	password: string;
	name: string;
	imgUrl?: string;
	tokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: String,
	},
	tokens: {
		type: [String],
		required: false,
	},
});

export default mongoose.model<IUser>('User', userSchema);

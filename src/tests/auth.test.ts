import { Express } from 'express';
import initApp from '../app';
import user_model, { IUser } from '../models/user_model';
import mongoose from 'mongoose';
import request from 'supertest';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

let app: Express;

const userInput: Omit<IUser, '_id' | 'tokens'> = {
	name: 'John',
	email: 'johnDoe@test.com',
	password: 'abcd1234',
	imgUrl: '/posts/test.jpg',
};

let user: IUser;
let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
	dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
	app = await initApp();
});

afterAll((done) => {
	user_model
		.findByIdAndDelete(user._id)
		.exec()
		.then(() => {
			mongoose.connection.close();
			done();
		});
});

describe('Auth API tests', () => {
	test('POST /register', async () => {
		const res = await request(app).post('/auth/register').send(userInput);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.tokens).toEqual([]);
		expect(res.body.name).toEqual(userInput.name);
		expect(
			await compare(userInput.password, res.body.password)
		).toBeTruthy();
		user = res.body;
	});

	test('POST /login', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: userInput.email, password: userInput.password });
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		expect(res.body.refreshToken).toBeDefined();
		accessToken = res.body.accessToken;
		refreshToken = res.body.refreshToken;
		user = res.body.user;
	});

	test('Middleware', async () => {
		const res = await request(app).get('/users/').send();
		expect(res.statusCode).not.toEqual(200);

		const res2 = await request(app)
			.get('/users/')
			.set('authorization', `Bearer ${accessToken}`);
		expect(res2.statusCode).toEqual(200);
		expect(res2.body).toBeInstanceOf(Array);
		expect(res2.body).toEqual(
			expect.arrayContaining([
				{
					_id: user._id,
					name: user.name,
					email: user.email,
					imgUrl: user.imgUrl,
					tokens: user.tokens,
				},
			])
		);
	});

	test('GET /users', async () => {
		const res = await request(app)
			.get('/users/')
			.set('authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body).toEqual(
			expect.arrayContaining([
				{
					_id: user._id,
					name: user.name,
					email: user.email,
					imgUrl: user.imgUrl,
					tokens: user.tokens,
				},
			])
		);
	});

	test('GET /user/:id', async () => {
		const res = await request(app)
			.get(`/users/${user._id}`)
			.set('authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({
			_id: user._id,
			name: user.name,
			email: user.email,
			imgUrl: user.imgUrl,
			tokens: user.tokens,
		});
	});

	test('PUT /users/:id', async () => {
		const update = {
			name: 'David',
		};
		const res = await request(app)
			.put(`/users/${user._id}`)
			.set('authorization', `Bearer ${accessToken}`)
			.send(update);
		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toEqual(update.name);
	});

	test('POST /refresh', async () => {
		// Remember to change ACCESS_TOKEN_EXPIRATION in .ENV to 5s
		await new Promise((r) => setTimeout(r, 7000));
		const res = await request(app)
			.get('/users/')
			.set('authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).not.toEqual(200);

		const res2 = await request(app)
			.get('/auth/refresh')
			.set('Authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res2.statusCode).toEqual(200);
		expect(res2.body).toHaveProperty('accessToken');
		expect(res2.body).toHaveProperty('refreshToken');
		accessToken = res2.body.accessToken;
		refreshToken = res2.body.refreshToken;

		const res3 = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${accessToken}`)
			.send();
		expect(res3.statusCode).toEqual(200);
	});

	test('Refresh Token hacked', async () => {
		const res = await request(app)
			.get('/auth/refresh')
			.set('Authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res.statusCode).toEqual(200);
		const newRefreshToken = res.body.refreshToken;
		const res2 = await request(app)
			.get('/auth/refresh')
			.set('Authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res2.statusCode).not.toEqual(200);
		const res3 = await request(app)
			.get('/auth/refresh')
			.set('Authorization', `Bearer ${accessToken}`)
			.set('refresh_token', newRefreshToken);
		expect(res3.statusCode).not.toEqual(200);
	});

	test('GET /logout', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: userInput.email, password: userInput.password });
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		expect(res.body.refreshToken).toBeDefined();
		accessToken = res.body.accessToken;
		refreshToken = res.body.refreshToken;

		const res2 = await request(app)
			.get('/auth/logout/')
			.set('authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res2.statusCode).toEqual(200);
		const userRes = await request(app)
			.get(`/users/${user._id}`)
			.set('authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(userRes.body.tokens).not.toContain(refreshToken);
	});

	test('DELETE /user/:id', async () => {
		const deleteRes = await request(app)
			.delete(`/users/${user._id}`)
			.set('authorization', `Bearer ${accessToken}`);
		expect(deleteRes.statusCode).toEqual(200);
		const getRes = await request(app)
			.get(`/users/${user._id}`)
			.set('authorization', `Bearer ${accessToken}`);
		expect(getRes.statusCode).toEqual(404);
		expect(getRes.body).toEqual({});
	});
});

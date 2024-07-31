import { Express } from 'express';
import initApp from '../app';
import { IUser } from '../models/user_model';
import mongoose from 'mongoose';
import request from 'supertest';
import { compare } from 'bcrypt';

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
	app = await initApp();
});

afterAll((done) => {
	mongoose.connection.close();
	done();
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
		const res = await request(app)
			.get('/auth/refresh/')
			.set('authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res.statusCode).toEqual(200);
		expect(res.body.refreshToken).not.toEqual(refreshToken);
		refreshToken = res.body.refreshToken;
	});

	test('GET /logout', async () => {
		const res = await request(app)
			.get('/auth/logout/')
			.set('authorization', `Bearer ${accessToken}`)
			.set('refresh_token', refreshToken);
		expect(res.statusCode).toEqual(200);
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

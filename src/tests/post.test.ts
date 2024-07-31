import initApp from '../app';
import mongoose from 'mongoose';
import postModel, { IPost } from '../models/post.model';
import { Express } from 'express';
import request from 'supertest';
import { IComment } from '../models/comment.model';

const port = process.env.PORT;
let app: Express;
let post: IPost & { _id: string };

beforeAll(async () => {
	app = await initApp();
});

afterAll((done) => {
	postModel
		.findByIdAndDelete(post._id)
		.exec()
		.then(() => {
			mongoose.connection.close();
			done();
		});
});

describe('Post API Tests', () => {
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmE5MDE2YjUzZGQxODEwMmYzYmFlZDEiLCJyYW5kb20iOiIyNTEwMiIsImlhdCI6MTcyMjM4MTAwMn0.nF7WcyZwAXSBgna8oehZ5lmQdLXdbkPyc4eanw6s7mU';
	const postInput: Omit<IPost, 'created' | 'comments'> = {
		title: 'Test Post',
		country: 'test',
		source: 'test',
		imgUrl: 'test',
		userId: '6623a0f01c16d9abe2da4fe1',
	};

	test('POST /posts/', async () => {
		const res = await request(app)
			.post('/posts/')
			.set('authorization', `Bearer ${token}`)
			.send(postInput);
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.title).toEqual(postInput.title);
		expect(res.body.userId).toEqual(postInput.userId);
		expect(res.body.created).toBeDefined();
		expect(res.body.comments).toEqual([]);
		post = res.body;
	});

	test('GET /posts/', async () => {
		const res = await request(app)
			.get('/posts/')
			.set('authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body).toEqual(expect.arrayContaining([post]));
	});

	test('GET /user/:id/posts/', async () => {
		const res = await request(app)
			.get(`/users/${postInput.userId}/posts/`)
			.set('authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Array);
		res.body.forEach((userPost) => {
			expect(userPost.userId).toEqual(postInput.userId);
		});
	});

	test('GET /post/:id', async () => {
		const res = await request(app)
			.get(`/posts/${post._id}`)
			.set('authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(post);
	});

	test('PUT /post/:id', async () => {
		const update = {
			title: 'New Title',
		};
		const res = await request(app)
			.put(`/posts/${post._id}`)
			.set('authorization', `Bearer ${token}`)
			.send(update);
		expect(res.statusCode).toEqual(200);
		expect(res.body.title).toEqual(update.title);
	});

	test('POST /post/:id/comments', async () => {
		const comment: Omit<IComment, 'created'> = {
			userId: '6623a0f01c16d9abe2da4fe1',
			text: 'comment',
		};
		const res = await request(app)
			.post(`/posts/${post._id}/comments`)
			.set('authorization', `Bearer ${token}`)
			.send(comment);
		expect(res.statusCode).toEqual(201);
		expect(res.body.comments).toBeInstanceOf(Array);
		expect(res.body.comments).toContainEqual(
			expect.objectContaining({ ...comment })
		);
	});

	test('DELETE /post/:id', async () => {
		const deleteRes = await request(app)
			.delete(`/posts/${post._id}`)
			.set('authorization', `Bearer ${token}`);
		expect(deleteRes.statusCode).toEqual(200);
		const getRes = await request(app)
			.get(`/posts/${post._id}`)
			.set('authorization', `Bearer ${token}`);
		expect(getRes.statusCode).toEqual(200);
		expect(getRes.body).toEqual({});
	});
});

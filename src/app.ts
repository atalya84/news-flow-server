import authRoute from './routes/auth_routes';
import postRouter from './routes/post.router';
import fileRouter from './routes/file_routes';
import userRouter from './routes/user.routes';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const initApp = (): Promise<Express> => {
	const promise = new Promise<Express>((resolve) => {
		const db = mongoose.connection;
		db.once('open', () => console.log('Connected to Database'));
		db.on('error', (error) => console.error(error));
		const url = process.env.DB_URL;
		mongoose
			.connect(url, {
				dbName: 'news-flow',
			})
			.then(() => {
				const app = express();
				app.use(cors());
				app.use(bodyParser.json());
				app.use(bodyParser.urlencoded({ extended: true }));
				app.use((req, res, next) => {
					res.header('Access-Control-Allow-Origin', '*');
					res.header('Access-Control-Allow-Methods', '*');
					res.header('Access-Control-Allow-Headers', '*');
					res.header('Access-Control-Allow-Credentials', 'true');
					next();
				});

				app.use('/profiles', express.static('profiles'));
				app.use('/posts', express.static('posts'));

				app.use('/auth', authRoute);
				app.use('/posts', postRouter);
				app.use('/users', userRouter);
				app.use('/file', fileRouter);

				app.get('/liveness', (req, res) => {
					res.status(200).send('OK');
				});

				resolve(app);
			});
	});
	return promise;
};

export default initApp;

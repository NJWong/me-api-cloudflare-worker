import { IRequest, Router } from 'itty-router';
import { connect } from '@planetscale/database';

// now let's create a router (note the lack of "new")
const router = Router();

// GET all characters
router.get('/api/characters', async (request: IRequest, env: Env) => {
	const config = {
		host: env.DATABASE_HOST,
		username: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
		fetch: (url: string, init?: Req) => {
			if (init && init['cache']) {
				delete init['cache'];
			}
			return fetch(url, init);
		},
	};

	const connection = connect(config);

	const data = await connection.execute('SELECT * FROM characters');

	return new Response(JSON.stringify(data.rows), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
});

// GET character
router.get('/api/characters/:id', async (request: IRequest, env: Env) => {
	const { id } = request.params;

	const config = {
		host: env.DATABASE_HOST,
		username: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
		fetch: (url: string, init?: Req) => {
			if (init && init['cache']) {
				delete init['cache'];
			}
			return fetch(url, init);
		},
	};

	const connection = connect(config);

	const data = await connection.execute(`SELECT * FROM characters WHERE id = ${id}`);

	return new Response(JSON.stringify(data.rows), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;

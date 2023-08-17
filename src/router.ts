import { IRequest, Router } from 'itty-router';
import { connect } from '@planetscale/database';

// now let's create a router (note the lack of "new")
const router = Router();

// GET all characters
router.get('/api/characters', async (request: IRequest, env: Env) => {
	const url = new URL(request.url);
	const params = new URLSearchParams(url.search);
	const limit = parseInt(params.get('limit') ?? '10') ?? 10;
	const offset = parseInt(params.get('offset') ?? '0') ?? 0;

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

	const query = `
		SELECT characters.id, characters.name, characters.class,
			(SELECT JSON_OBJECT('id', species.id, 'name', species.name, 'url', CONCAT('https://me-api.njwon4.workers.dev/api/species/', species.id)) FROM species WHERE species.id = characters.species) AS species,
			(SELECT JSON_OBJECT('id', genders.id, 'name', genders.name, 'url', CONCAT('https://me-api.njwon4.workers.dev/api/genders/', genders.id)) FROM genders WHERE genders.id = characters.gender) AS gender
		FROM characters
		LIMIT ${limit}
		OFFSET ${offset};
	`;

	const characterResult = await connection.execute(query);

	const countResult = await connection.execute('SELECT COUNT(*) FROM characters');

	const response = {
		meta: {
			limit,
			offset,
			total: parseInt(countResult.rows[0]['count(*)']),
		},
		data: characterResult.rows,
	};

	return new Response(JSON.stringify(response), {
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

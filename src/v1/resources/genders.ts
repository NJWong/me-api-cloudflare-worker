import { IRequest, Router } from 'itty-router';
import { connect } from '@planetscale/database';

const router = Router({ base: '/api/v1/genders' });

router.get('/', async (request: IRequest, env: Env) => {
	const url = new URL(request.url);
	const params = new URLSearchParams(url.search);
	const limit = parseInt(params.get('limit') ?? '10') ?? 10;
	const cappedLimit = limit > 100 ? 100 : limit;
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
		SELECT genders.id, genders.name
		FROM genders
		LIMIT ${cappedLimit}
		OFFSET ${offset};
	`;

	const speciesResult = await connection.execute(query);

	const countResult = await connection.execute('SELECT COUNT(*) FROM genders');

	const response = {
		meta: {
			limit: cappedLimit,
			offset,
			total: parseInt(countResult.rows[0]['count(*)']),
		},
		data: speciesResult.rows,
	};

	return new Response(JSON.stringify(response), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
});

router.get('/:id', async (request: IRequest, env: Env) => {
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

	const query = `SELECT genders.id, genders.name FROM genders WHERE genders.id = ${id}`;

	const data = await connection.execute(query);

	return new Response(JSON.stringify(data.rows), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
});

export default router;

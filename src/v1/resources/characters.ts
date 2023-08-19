import { IRequest, Router } from 'itty-router';
import { connect } from '@planetscale/database';
import { baseApiPath } from '../consts';

// Note, we must include the complete base path here
const router = Router({ base: '/api/v1/characters' });

// GET all characters
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
		SELECT characters.id, characters.name, characters.class,
			JSON_OBJECT('id', species.id, 'name', species.name, 'url', CONCAT('${baseApiPath}/v1/species/', species.id)) AS species,
			JSON_OBJECT('id', genders.id, 'name', genders.name, 'url', CONCAT('${baseApiPath}/v1/genders/', genders.id)) AS gender
		FROM characters
		JOIN species ON species.id = characters.species
		JOIN genders ON genders.id = characters.gender
		LIMIT ${cappedLimit}
		OFFSET ${offset};
	`;

	const characterResult = await connection.execute(query);

	const countResult = await connection.execute('SELECT COUNT(*) FROM characters');

	const response = {
		meta: {
			limit: cappedLimit,
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

	const query = `
		SELECT characters.id, characters.name, characters.class,
			(SELECT JSON_OBJECT('id', species.id, 'name', species.name, 'url', CONCAT('${baseApiPath}/v1/species/', species.id)) FROM species WHERE species.id = characters.species) AS species,
			(SELECT JSON_OBJECT('id', genders.id, 'name', genders.name, 'url', CONCAT('${baseApiPath}/v1/genders/', genders.id)) FROM genders WHERE genders.id = characters.gender) AS gender
		FROM characters
		WHERE characters.id = ${id};
	`;

	const data = await connection.execute(query);

	return new Response(JSON.stringify(data.rows), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
});

export default router;

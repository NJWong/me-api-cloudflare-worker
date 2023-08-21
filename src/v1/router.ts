import { Router } from 'itty-router';
import charactersRouter from './resources/characters';
import gendersRouter from './resources/genders';
import speciesRouter from './resources/species';

// Note, we must include the complete base path here
const router = Router({ base: '/api/v1' });

router.get('/characters/*', charactersRouter.handle);
router.get('/genders/*', gendersRouter.handle);
router.get('/species/*', speciesRouter.handle);

// Show page that links to the docs
router.all('*', () => {
	const html = `
		<html>
			<head>
				<title>ME-API - v1 API</title>
			</head>
			<body>
				<h1>ME-API - v1 API</h1>
				<p>Welcome! You've found the base path for the v1 API, so there's nothing here.</p>
				<p>Go to a path like <a href="/api/v1/characters">/api/v1/characters</a> to see some data, or check out the API documentation website at <a href="https://me-api-docs.pages.dev">https://me-api-docs.pages.dev</a>.</p>
			</body>
		</html>
	`;

	return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
});

export default router;

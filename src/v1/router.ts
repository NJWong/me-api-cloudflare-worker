import { Router } from 'itty-router';
import charactersRouter from './resources/characters';

// Note, we must include the complete base path here
const router = Router({ base: '/api/v1' });

router.get('/characters/*', charactersRouter.handle);

// Show page that links to the docs
router.all('*', () => {
	const html = `
		<html>
			<head>
				<title>ME-API - v1</title>
			</head>
			<body>
				<h1>Not Found</h1>
				<p>The requested resource could not be found.</p>
				<p>You can find the documentation for the API at <a href="https://me-api-docs.pages.dev">https://me-api-docs.pages.dev</a></p>
			</body>
		</html>
	`;

	return new Response(html, { status: 404, headers: { 'Content-Type': 'text/html' } });
});

export default router;

import { Router } from 'itty-router';
import routerV1 from './v1/router';

const router = Router();

// v1 API handler
router.get('/api/v1/*', routerV1.handle);

// 404 for everything else
router.all('*', () => {
	const html = `
		<html>
			<head>
				<title>ME-API</title>
			</head>
			<body>
				<h1>Welcome!</h1>
				<p>This is the base path for ME-API, so there's nothing here. The v1 API starts <a href="/api/v1">here!</a></p>
				<p>You can find the documentation for the API at <a href="https://me-api-docs.pages.dev">https://me-api-docs.pages.dev</a></p>
			</body>
		</html>
	`;

	return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
});

export default router;

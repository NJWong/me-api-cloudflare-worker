import { Router } from 'itty-router';

// now let's create a router (note the lack of "new")
const router = Router();

// GET collection index
router.get('/api/characters', () => new Response('All characters'));

// GET item
router.get('/api/characters/:id', ({ params }) => new Response(`Character with ID: ${params.id}`));

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;

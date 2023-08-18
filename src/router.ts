import { Router } from 'itty-router';
import routerV1 from './v1/router';

const router = Router({ base: '/api' });

// v1 API handler
router.get('/v1/*', routerV1.handle);

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;

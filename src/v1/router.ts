import { Router } from 'itty-router';
import charactersRouter from './resources/characters';

// Note, we must include the complete base path here
const router = Router({ base: '/api/v1' });

router.get('/characters/*', charactersRouter.handle);

export default router;

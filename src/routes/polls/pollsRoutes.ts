import { Router } from 'express';
import * as pollsService from './pollsController';
const router = Router();

router.get('/test', (req, res) => {
    console.log('Polls test route accessed');
    res.send('Polls test route works!');
});

export default router;
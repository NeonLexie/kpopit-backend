import { Router } from 'express';
import * as Controller from './pollsController';
const router = Router();

router.get('/test', (req, res) => {
    console.log('Polls test route accessed');
    res.send('Polls test route works!');
});

router.get('/all',Controller.getAllPolls)
router.get('/user_id/:userId',Controller.getPollByUserId)
router.get('/id/:pollId', Controller.getPollById)

export default router;
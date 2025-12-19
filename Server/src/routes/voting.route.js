import { Router } from 'express';
import {voteToCandidate, getVoteCount } from '../controllers/voting.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();


router.post('/:candidateId', protectRoute, voteToCandidate);
router.get('/voteCount', getVoteCount);



export default router;
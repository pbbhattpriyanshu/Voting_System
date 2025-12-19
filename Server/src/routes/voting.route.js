import { Router } from 'express';
import {voteToCandidate, getVoteCount, showCandidates } from '../controllers/voting.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();

router.get('/showCandidates', showCandidates);
router.post('/:candidateId', protectRoute, voteToCandidate);
router.get('/voteCount', getVoteCount);



export default router;
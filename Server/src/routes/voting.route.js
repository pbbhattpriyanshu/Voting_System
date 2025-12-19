import { Router } from 'express';
import {voteToCandidate } from '../controllers/voting.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();


router.post('/:candidateId', protectRoute, voteToCandidate);




export default router;
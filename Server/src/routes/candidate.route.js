import { Router } from 'express';
import {registerCandidate, updateCandidate, deleteCandidate } from '../controllers/candidate.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();


router.post('/register', protectRoute, registerCandidate);
router.put('/update/:id', protectRoute, updateCandidate);
router.delete('/delete/:id', protectRoute, deleteCandidate);



export default router;
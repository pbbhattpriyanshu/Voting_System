import { Router } from 'express';
import { } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();


router.post('/register')
router.post('/update/:id' )
router.post('/delete/:id' )



export default router;
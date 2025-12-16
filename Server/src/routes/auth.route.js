import { Router } from 'express';
import { signup, login, logout, profile, password} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = Router();


router.post('/signup', signup )
router.post('/login', login )
router.post('/logout', logout )

router.get('/profile', protectRoute, profile)
router.put('/profile/password', protectRoute, password)


export default router;
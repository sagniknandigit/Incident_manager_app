import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { saveFcmToken } from '../controllers/user.controller';

const router = Router();

router.get('/', protect, authorize('MANAGER', 'ENGINEER', 'REPORTER'), getUsers);
router.post('/save-fcm-token',protect,saveFcmToken);

export default router;

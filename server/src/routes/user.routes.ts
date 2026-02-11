import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/', protect, authorize('MANAGER', 'ENGINEER', 'REPORTER'), getUsers);

export default router;

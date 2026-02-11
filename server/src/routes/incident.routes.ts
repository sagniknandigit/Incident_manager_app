import { Router } from "express";
import { createIncident, getAllIncidents, updateIncidentStatus, assignIncident } from '../controllers/incident.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', protect, authorize('REPORTER'), createIncident);

// Allow all roles to view, but Controller will filter
router.get('/', protect, authorize('MANAGER', 'REPORTER', 'ENGINEER'), getAllIncidents);

router.patch('/:id/status', protect, authorize('ENGINEER'), updateIncidentStatus);
router.put('/:id/assign', protect, authorize('MANAGER'), assignIncident);

export default router;
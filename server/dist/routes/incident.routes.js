"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incident_controller_1 = require("../controllers/incident.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('REPORTER'), incident_controller_1.createIncident);
// Allow all roles to view, but Controller will filter
router.get('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('MANAGER', 'REPORTER', 'ENGINEER'), incident_controller_1.getAllIncidents);
router.patch('/:id/status', auth_middleware_1.protect, (0, role_middleware_1.authorize)('ENGINEER'), incident_controller_1.updateIncidentStatus);
router.put('/:id/assign', auth_middleware_1.protect, (0, role_middleware_1.authorize)('MANAGER'), incident_controller_1.assignIncident);
router.get('/assigned', auth_middleware_1.protect, (0, role_middleware_1.authorize)('ENGINEER'), incident_controller_1.getAssignedIncidents);
router.put('/:id/status', auth_middleware_1.protect, (0, role_middleware_1.authorize)('ENGINEER'), incident_controller_1.updateIncidentStatus);
router.get('/my', auth_middleware_1.protect, (0, role_middleware_1.authorize)('REPORTER'), incident_controller_1.getMyIncidents);
router.get('/stats', auth_middleware_1.protect, (0, role_middleware_1.authorize)('MANAGER'), incident_controller_1.getIncidentStats);
exports.default = router;

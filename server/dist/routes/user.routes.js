"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('MANAGER', 'ENGINEER', 'REPORTER'), user_controller_1.getUsers);
exports.default = router;

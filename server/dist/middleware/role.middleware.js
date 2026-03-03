"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...allowedRoles) => (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
            message: 'Access denied: insufficient permissions',
        });
    }
    next();
};
exports.authorize = authorize;

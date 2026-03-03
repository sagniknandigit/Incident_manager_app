"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('[Middleware] Auth Header:', authHeader);
    // Check if Authorization header exists
    if (!authHeader) {
        console.log('[Middleware] No Auth Header found');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    // Extract token: Handle "Bearer <token>" or "Bearer<token>" or just "<token>"
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (authHeader.startsWith('Bearer')) {
        // Handle missing space case
        token = authHeader.substring(6);
    }
    else {
        // Fallback: assume the whole header is the token
        token = authHeader;
    }
    console.log(`[Middleware] Extracted Token: ${token.substring(0, 10)}... (Length: ${token.length})`);
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach user info to request
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};
exports.protect = protect;

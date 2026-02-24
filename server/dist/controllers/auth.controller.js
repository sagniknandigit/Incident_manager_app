"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['error'],
});
/* ===================== REGISTER ===================== */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const allowedRoles = ['REPORTER', 'ENGINEER', 'MANAGER'];
        const roleToSave = allowedRoles.includes(role)
            ? role
            : 'REPORTER';
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: roleToSave,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.register = register;
/* ===================== LOGIN ===================== */
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.login = login;
/* ===================== GET CURRENT USER ===================== */
const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        console.error('GetMe error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMe = getMe;

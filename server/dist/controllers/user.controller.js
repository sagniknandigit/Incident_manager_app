"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let whereClause = {};
        if (role) {
            whereClause = { role: String(role) };
        }
        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getUsers = getUsers;

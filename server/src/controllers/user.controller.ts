import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

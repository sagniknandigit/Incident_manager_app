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
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

export const saveFcmToken = async (req: Request, res: Response) => {
    try {
        const { fcmtoken } = req.body;
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!fcmtoken) {
            return res.status(400).json({ message: 'FCM token is required' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { fcmtoken },
        });

        res.json({ message: 'FCM token saved successfully' });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ message: 'Failed to save notification token' });
    }
};
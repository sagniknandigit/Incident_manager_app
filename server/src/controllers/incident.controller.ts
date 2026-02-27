import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendPushNotification } from '../utils/sendNotification';

const prisma = new PrismaClient();

export const createIncident = async (req: Request, res: Response) => {
    try {
        const { title, description, priority } = req.body;
        const user = (req as any).user;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                reporterId: user.userId,
            },
        });
        res.status(201).json(incident);
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(500).json({ message: 'Failed to create incident' });
    }
};

export const getAllIncidents = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let whereClause = {};

        if (user.role === 'REPORTER') {
            whereClause = { reporterId: user.userId };
        } else if (user.role === 'ENGINEER') {
            whereClause = { engineerId: user.userId };
        }

        const incidents = await prisma.incident.findMany({
            where: whereClause,
            include: {
                reporter: { select: { id: true, name: true, email: true } },
                engineer: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(incidents);
    } catch (error) {
        console.error('Error fetching all incidents:', error);
        res.status(500).json({ message: 'Failed to fetch incidents' });
    }
};

export const assignIncident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { engineerId } = req.body;

        if (!engineerId) {
            return res.status(400).json({ message: 'Engineer ID is required' });
        }

        const incident = await prisma.incident.update({
            where: { id: Number(id) },
            data: {
                engineerId: Number(engineerId),
                status: 'IN_PROGRESS'
            },
        });

        // FIX: Fetch engineer to get their fcmtoken
        const engineer = await prisma.user.findUnique({
            where: { id: Number(engineerId) },
            select: { fcmtoken: true, name: true }
        });

        if (engineer && engineer.fcmtoken) {
            try {
                await sendPushNotification(
                    engineer.fcmtoken,
                    'New Mission Assigned',
                    `You have been assigned to: ${incident.title}`
                );
            } catch (notifyError) {
                console.error('Push notification failed for engineer:', notifyError);
            }
        }

        res.json(incident);
    } catch (error) {
        console.error('Error assigning incident:', error);
        res.status(500).json({ message: 'Error assigning incident' });
    }
};

export const getAssignedIncidents = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const incidents = await prisma.incident.findMany({
            where: { engineerId: user.userId },
            include: {
                reporter: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(incidents);
    } catch (error) {
        console.error('Error fetching assigned incidents:', error);
        res.status(500).json({ message: 'Failed to fetch assigned incidents' });
    }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = (req as any).user;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const incident = await prisma.incident.update({
            where: {
                id: Number(id),
                engineerId: user.userId
            },
            data: { status },
        });

        const reporter = await prisma.user.findUnique({
            where: { id: incident.reporterId },
            select: { fcmtoken: true }
        });

        if (reporter && reporter.fcmtoken) {
            try {
                await sendPushNotification(
                    reporter.fcmtoken,
                    'Incident Update',
                    `Your reported incident "${incident.title}" is now: ${incident.status}`
                );
            } catch (notifyError) {
                console.error('Push notification failed for reporter:', notifyError);
            }
        }
        res.json(incident);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Failed to update incident status' });
    }
};

export const getMyIncidents = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const incidents = await prisma.incident.findMany({
            where: {
                reporterId: user.userId,
            },
            include: {
                engineer: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(incidents);
    } catch (error) {
        console.error('Error fetching my incidents:', error);
        res.status(500).json({ message: 'Failed to fetch your incidents' });
    }
};

export const getIncidentStats = async (req: Request, res: Response) => {
    try {
        const total = await prisma.incident.count();
        const grouped = await prisma.incident.groupBy({
            by: ['status'],
            _count: { status: true },
        });

        const stats: any = {
            total,
            OPEN: 0,
            IN_PROGRESS: 0,
            RESOLVED: 0,
            CLOSED: 0,
        };
        grouped.forEach((item) => {
            stats[item.status] = item._count.status;
        });
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};
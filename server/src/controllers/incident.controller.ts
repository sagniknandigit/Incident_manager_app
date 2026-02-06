import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createIncident = async (req: Request, res: Response) => {
    const { title, description, priority } = req.body;
    const user = (req as any).user;
    const incident = await prisma.incident.create({
        data: {
            title,
            description,
            priority,
            reporterId: user.userId,
        },
    });
    res.status(201).json(incident);
};

export const getAllIncidents = async (req: Request, res: Response) => {
    const user = (req as any).user;
    let whereClause = {};

    if (user.role === 'REPORTER') {
        whereClause = { reporterId: user.userId };
    } else if (user.role === 'ENGINEER') {
        whereClause = { engineerId: user.userId };
    }
    // MANAGER gets all (empty whereClause)

    const incidents = await prisma.incident.findMany({
        where: whereClause,
        include: {
            reporter: true,
            engineer: true,
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const incident = prisma.incident.update({
        where: { id: Number(id) },
        data: { status },
    });
    res.json(incident);
};
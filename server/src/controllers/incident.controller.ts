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



export const assignIncident = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { engineerId } = req.body;
    try {
        const incident = await prisma.incident.update({
            where: { id: Number(id) },
            data: {
                engineerId: Number(engineerId),
                status: 'IN_PROGRESS'
            },
        });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning incident', error });
    }
};

export const getAssignedIncidents = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const incidents = await prisma.incident.findMany({
        where: { engineerId: user.userId },
        include: {
            reporter: {
                select: { name: true }
            }
        },
    });
    res.json(incidents);
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    const incident = await prisma.incident.update({
        where: {
            id: Number(id),
            engineerId: user.userId // Optional: ensure only assigned engineer can update
        },
        data: { status },
    });
    res.json(incident);
};

export const getMyIncidents = async (req: Request, res: Response) => {
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
};

export const getIncidentStats=async(req:Request,res:Response)=>{
    try{
        const total=await prisma.incident.count();
        const grouped=await prisma.incident.groupBy({
            by:['status'],
            _count:{status:true,},
        });

        const stats={
            total,
            OPEN:0,
            IN_PROGRESS:0,
            RESOLVED:0,
            CLOSED:0,
        };
        grouped.forEach((item)=>{
            stats[item.status]=item._count.status;
        });
        res.json(stats);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'Failed to fetch stats'});
    }
};
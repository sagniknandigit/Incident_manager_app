"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncidentStats = exports.getMyIncidents = exports.updateIncidentStatus = exports.getAssignedIncidents = exports.assignIncident = exports.getAllIncidents = exports.createIncident = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createIncident = async (req, res) => {
    const { title, description, priority } = req.body;
    const user = req.user;
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
exports.createIncident = createIncident;
const getAllIncidents = async (req, res) => {
    const user = req.user;
    let whereClause = {};
    if (user.role === 'REPORTER') {
        whereClause = { reporterId: user.userId };
    }
    else if (user.role === 'ENGINEER') {
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
exports.getAllIncidents = getAllIncidents;
const assignIncident = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error assigning incident', error });
    }
};
exports.assignIncident = assignIncident;
const getAssignedIncidents = async (req, res) => {
    const user = req.user;
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
exports.getAssignedIncidents = getAssignedIncidents;
const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const incident = await prisma.incident.update({
        where: {
            id: Number(id),
            engineerId: user.userId // Optional: ensure only assigned engineer can update
        },
        data: { status },
    });
    res.json(incident);
};
exports.updateIncidentStatus = updateIncidentStatus;
const getMyIncidents = async (req, res) => {
    const user = req.user;
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
exports.getMyIncidents = getMyIncidents;
const getIncidentStats = async (req, res) => {
    try {
        const total = await prisma.incident.count();
        const grouped = await prisma.incident.groupBy({
            by: ['status'],
            _count: { status: true, },
        });
        const stats = {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};
exports.getIncidentStats = getIncidentStats;

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});

/* ===================== REGISTER ===================== */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body || {};

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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


    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

/* ===================== GET CURRENT USER ===================== */
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

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
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

import { Request, Response } from 'express';
import { User } from '../models/user.js';

// GET /Users/:id
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // POST /Users
  export const createUser = async (req: Request, res: Response) => {
    console.log('Received registration request:', req.body);
    const { username, password } = req.body;
    try {
      const newUser = await User.create({ username, password });
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(400).json({ message: error.message });
    }
  };
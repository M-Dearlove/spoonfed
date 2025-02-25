import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    console.log('Login attempt for username:', req.body.username); // Add logging
    
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            where: { username },
        });

        console.log('Found User:', user ? 'yes' : 'no');

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid password' });
        }

        const jwtKey = process.env.JWT_SECRET_KEY;
        if (!jwtKey) {
            console.error('JWT_SECRET_KEY not set in environment');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign({ 
            username,
            userId: user.id 
        }, jwtKey, { expiresIn: '1h' });
        
        console.log('Generated token payload:', { username, userId: user.id });
        
        return res.json({ 
            token,
            userId: user.id 
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

export default router;
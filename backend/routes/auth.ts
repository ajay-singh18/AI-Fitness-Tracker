import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

router.post(['/register', '/local/register'], async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: { message: 'Please add all fields' } });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: { message: 'Username already taken' } });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        jwt: generateToken(user._id.toString()),
        user: user.toJSON()
      });
    } else {
      res.status(400).json({ error: { message: 'Invalid user data' } });
    }
  } catch (error) {
    next(error);
  }
});

router.post(['/login', '/local'], async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { email, identifier, password } = req.body;
    
    // Strapi compatibility
    const loginIdentifier = email || identifier;

    const user = await User.findOne({ 
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }] 
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        jwt: generateToken(user._id.toString()),
        user: user.toJSON()
      });
    } else {
      res.status(400).json({ error: { message: 'Invalid credentials' } });
    }
  } catch (error) {
    next(error);
  }
});

export default router;

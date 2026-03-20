import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/me', protect, async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user) {
       return res.status(401).json({ error: { message: 'Not authorized' } });
    }
    res.json(req.user.toJSON());
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user || req.user._id.toString() !== req.params.id) {
       return res.status(401).json({ error: { message: 'Not authorized to update this profile' } });
    }

    const { age, weight, height, goal, dailyCalorieIntake, dailyCalorieBurn } = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
      user.age = age !== undefined ? Number(age) : user.age;
      user.weight = weight !== undefined ? Number(weight) : user.weight;
      user.height = height !== null && height !== undefined ? Number(height) : user.height;
      user.goal = goal || user.goal;
      user.dailyCalorieIntake = dailyCalorieIntake !== undefined ? Number(dailyCalorieIntake) : user.dailyCalorieIntake;
      user.dailyCalorieBurn = dailyCalorieBurn !== undefined ? Number(dailyCalorieBurn) : user.dailyCalorieBurn;

      const updatedUser = await user.save();
      
      res.json(updatedUser.toJSON());
    } else {
      res.status(404).json({ error: { message: 'User not found' } });
    }
  } catch (error) {
    next(error);
  }
});

export default router;

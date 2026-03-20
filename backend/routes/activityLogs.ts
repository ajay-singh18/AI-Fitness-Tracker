import express, { Request, Response, NextFunction } from 'express';
import ActivityLog from '../models/ActivityLog';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) return;
    const logs = await ActivityLog.find({ user: req.user._id })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
      
    res.json(logs.map(log => log.toJSON()));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user) return res.status(401).json({ error: { message: 'Not authorized' } });

    const data = req.body.data || req.body;
    
    if (!data.name || !data.duration || !data.calories) {
      return res.status(400).json({ error: { message: 'Please provide name, duration, and calories' } });
    }

    const log = await ActivityLog.create({
      name: data.name,
      duration: data.duration,
      calories: data.calories,
      user: req.user._id
    });

    await log.populate('user', 'username email');

    res.status(201).json(log.toJSON());
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user) return res.status(401).json({ error: { message: 'Not authorized' } });

    const log = await ActivityLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: { message: 'Log not found' } });
    }

    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: { message: 'Not authorized' } });
    }

    await log.deleteOne();

    res.json({ message: 'Log removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

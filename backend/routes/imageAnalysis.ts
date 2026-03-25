import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { analyzeImage } from '../services/gemini';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No image uploaded' } });
    }

    const filePath = req.file.path;
    
    try {
      const result = await analyzeImage(filePath);
      
      fs.unlinkSync(filePath);
      
      return res.json({ success: true, result });
    } catch (error: any) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(500).json({ error: { message: 'Analysis failed: ' + error.message } });
    }
  } catch (error) {
    next(error);
  }
});

export default router;

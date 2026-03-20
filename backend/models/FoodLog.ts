import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IFoodLog extends Document {
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  user: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const foodLogSchema = new mongoose.Schema<IFoodLog>({
  name: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  calories: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

foodLogSchema.set('toJSON', {
  transform: (doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.documentId = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

const FoodLog: Model<IFoodLog> = mongoose.model<IFoodLog>('FoodLog', foodLogSchema);

export default FoodLog;

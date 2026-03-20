import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IActivityLog extends Document {
  name: string;
  duration: number;
  calories: number;
  user: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new mongoose.Schema<IActivityLog>({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
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

activityLogSchema.set('toJSON', {
  transform: (doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.documentId = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  thumbnail: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ?? mongoose.model<IAchievement>('Achievement', AchievementSchema);

export default Achievement;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  icon: string;
  order: number;
  category: 'technical' | 'soft';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    category: { type: String, enum: ['technical', 'soft'], default: 'technical' },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Skill: Model<ISkill> =
  mongoose.models.Skill ?? mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;

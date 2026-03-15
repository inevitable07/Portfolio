import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  thumbnail: string;
  colorTheme: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    colorTheme: {
      type: String,
      default: 'sky',
      enum: ['sky', 'violet', 'emerald', 'rose', 'indigo', 'amber'],
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

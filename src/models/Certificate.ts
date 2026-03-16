import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  name: string;
  thumbnail: string;
  certificateLink: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    certificateLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ?? mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;

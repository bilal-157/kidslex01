import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  isUsed: boolean;
  attempts: number;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expires: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// ✅ Make sure this export exists
const OTP: Model<IOTP> = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
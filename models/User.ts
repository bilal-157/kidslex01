import mongoose, { Schema, Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  { timestamps: true }
);

// ✅ Use next-based callback (not async) to avoid the TypeError
UserSchema.pre('save', function () {
  const user = this;

  if (!user.isModified('password')) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    bcrypt.hash(user.password, 12, (err, hash) => {
      if (err) return reject(err);
      user.password = hash!;
      resolve();
    });
  });
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
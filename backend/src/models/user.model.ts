// user.model.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName: { type: String, required: true , trim: true },
  lastName: { type: String, required: true , trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);


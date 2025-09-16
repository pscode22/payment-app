// refreshToken.model.ts
import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true },
  sessionExp: { type: Number, required: true }, // epoch ms
}, { timestamps: true });

export const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

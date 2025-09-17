import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing');
  };
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Mongo connected');
};

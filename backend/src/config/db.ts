import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Mongo connected');
  process.exit(1);
};

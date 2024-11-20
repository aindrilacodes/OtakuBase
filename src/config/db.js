import mongoose from 'mongoose';
import { DB_URL } from '../../envAccess.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(DB_URL);
    console.log("connection successful")
    console.log(
      `MongoDB connected!! DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;

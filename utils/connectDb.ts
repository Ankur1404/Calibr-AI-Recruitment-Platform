import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string | undefined = process.env.NEXT_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the NEXT_MONGODB_URI environment variable inside .env.local");
}
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn; 

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000 
    }).catch((err) => {
      cached.promise = null; 
      throw new Error(`MongoDB connection error: ${err.message}`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    throw new Error(`Failed to establish MongoDB connection: ${(err as Error).message}`);
  }
  global.mongooseCache = cached;
  return cached.conn!;
}

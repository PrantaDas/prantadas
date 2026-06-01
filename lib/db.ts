import mongoose from "mongoose";

const cached = global as typeof global & {
  _mongooseConn?: Promise<typeof mongoose>;
};

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (mongoose.connection.readyState === 1) return mongoose;

  if (!cached._mongooseConn) {
    cached._mongooseConn = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
      })
      .catch((err) => {
        // Reset cache so the next request retries
        cached._mongooseConn = undefined;
        throw err;
      });
  }

  return cached._mongooseConn;
}

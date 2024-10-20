import mongoose, { Connection, ConnectOptions } from "mongoose";

let cachedConnection: Connection | null = null;
let isConnecting: boolean = false;
let isConnected: boolean = false;

export async function connect(): Promise<Connection> {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return cachedConnection!;
  }

  if (isConnecting) {
    console.log("Connection is in progress");
    while (!isConnected) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return cachedConnection!;
  }

  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set");
  }

  try {
    isConnecting = true;
    const options: ConnectOptions = {

    };

    const connection = await mongoose.connect(process.env.MONGO_URL, options);
    cachedConnection = connection.connection;
    isConnected = true;
    isConnecting = false;
    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    isConnecting = false;
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export const close = async (): Promise<void> => {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      isConnected = false;
      cachedConnection = null;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      throw error;
    }
  }
};
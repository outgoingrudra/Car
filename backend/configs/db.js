import mongoose  from "mongoose";   


const connectDB = async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || "car-rental",
        serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connected successfully");
}

export default connectDB;

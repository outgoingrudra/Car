import mongoose  from "mongoose";   


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
            
    }
    catch (error) {
        console.log("Error connecting to database", error.message);
    }
}

export default connectDB;
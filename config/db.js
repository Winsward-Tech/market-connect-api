import mongoose from "mongoose";


//connect to mongodb
export default function connectDb(){
try {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB connected")
    })
} catch (error) {
    console.log("MongoDB connection failed",error.message);
    process.exit(1);
}}
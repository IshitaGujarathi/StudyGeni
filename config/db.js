import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)    //Process.env.env -> used to access the respective environment variable 
    console.log('Database connected successfully')

  } catch (error) {
    console.error('Error connecting to database:',error)
    process.exit(1)
  }
}

export default connectDB;
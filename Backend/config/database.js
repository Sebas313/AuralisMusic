import mongoose from "mongoose";

async function connectDB () {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log("se ha establecido conexion a la base de datos ")
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;
import mongoose from "mongoose";
import 'dotenv/config';

async function connectDB () {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI,{

            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log("se ha establecido conexion a la base de datos ")
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;






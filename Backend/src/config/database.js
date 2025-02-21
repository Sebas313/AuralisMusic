import mongoose from "mongoose";
import 'dotenv/config';

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Base de datos conectada.");
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error.message);
        process.exit(1);
    }
}


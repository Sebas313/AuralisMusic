import "dotenv/config";
import bcrypt from "bcrypt";
import Usuarios from "../Modelos/usuariosModelos.js";
import connectDB from "../config/database.js";
import mongoose from "mongoose";
import usuariosController from "../Controladores/usuariosController.js"


(async function usuariosSeeder() {
    try {
      
      await connectDB();
  
      
      const hashedPassword = await bcrypt.hash(
        process.env.SEEDER_USER_PASSWORD,
        10
      );
  
      
      const user = await Usuarios.create({
        nombre: "Carlos Barragan",
        email: "Carlos@starwars.com",
        password: hashedPassword, 
      });
  
      
      if (user) {
        console.log("[Seeder] User created successfully!");
      } else {
        console.log("[Seeder] Failed to create user.");
      }
  
      
      mongoose.connection.close();
      process.exit(0);
    } catch (error) {
    
      process.exit(1);
    }
  })();
import "dotenv/config";
import bcrypt from "bcrypt";
import Usuarios from "../Modelos/usuariosModelos.js";
import connectDB from "../config/database.js";
import mongoose from "mongoose";
import usuariosController from "../Controladores/usuariosController.js"


(async function usuariosSeeder() {
    try {
      // Connect to the database
      await connectDB();
  
      // Hash the password before creating the user
      const hashedPassword = await bcrypt.hash(
        process.env.SEEDER_USER_PASSWORD,
        10
      );
  
      // Create the user
      const user = await Usuarios.create({
        nombre: "Carlos Barragan",
        email: "Carlos@starwars.com",
        password: hashedPassword, // Use the hashed password
      });
  
      // Check if the user was created successfully
      if (user) {
        console.log("[Seeder] User created successfully!");
      } else {
        console.log("[Seeder] Failed to create user.");
      }
  
      // Exit the process with success
      mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      // Exit with error
      process.exit(1);
    }
  })();
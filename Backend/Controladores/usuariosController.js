
import Usuario from "../Modelos/usuariosModelos.js"
import usuariosModelos from "../Modelos/usuariosModelos.js"
import formulario from "nodemailer"


export const Registro = async (request, response) => {

    const  {    
        nombre,
        email,
        password
      
          
    }=request.body
    
    const NuevoUsuario = new Usuario({
        nombre,
        email,
        password
    })
    await new Usuario.save();
    response.status(201).json("Usuario Registrado") 

       if(post.nombre == undefined || post.nombre == null || post.nombre == "" ){
            response.json({state:false, mensaje:"el campo nombre es oblogatorio"})
            return false 
    }
    
 if(post.email == undefined || post.email == null || post.email == "" ){
        response.json({state:false, mensaje:"el campo email es oblogatorio"})
        return false 
        }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(post.email) == false){
        response.json({state: false , mensaje:"el email no es valido"})
        return false 
    }
    
  if(post.password == undefined || post.password == null || post.password == "" ){
            response.json({state:false, mensaje:"el campo password es oblogatorio"})
            return false 
            }

            

        }


        export default {Registro}


        
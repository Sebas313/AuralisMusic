import Usuario from "../Modelos/usuariosModelos.js";
import formulario from "nodemailer";

export const Registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const NuevoUsuario = new Usuario({
      nombre,
      email,
      password,
    });

    if (post.nombre == undefined || post.nombre == null || post.nombre == "") {
      response.json({
        state: false,
        mensaje: "el campo nombre es oblogatorio",
      });
      return false;
    }

    if (post.email == undefined || post.email == null || post.email == "") {
      response.json({ state: false, mensaje: "el campo email es oblogatorio" });
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(post.email) == false) {
      response.json({ state: false, mensaje: "el email no es valido" });
      return false;
    }

    if (
      post.password == undefined ||
      post.password == null ||
      post.password == ""
    ) {
      response.json({
        state: false,
        mensaje: "el campo password es oblogatorio",
      });
      return false;
    }

    await NuevoUsuario.save();
    res.status(201).json("Usuario Registrado");
  } catch (error) {
    console.error("Error al registrar el usuario", error.message);
    res.status(500).json({ message: "Error al registrar el usuario.", error:error.message })
  }
};

export default { Registro };

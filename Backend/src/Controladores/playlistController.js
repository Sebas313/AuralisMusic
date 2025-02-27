import PlayList from "../Modelos/playlistModelos.js";
import Canciones from "../Modelos/cancionesModelos.js";
import Usuario from "../Modelos/usuariosModelos.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export const crear = async (req, res) => {
    try {
      let { creadoPor, canciones, nombre } = req.body;

      console.log("Datos recibidos:", { creadoPor, canciones, nombre });

      // Asegurarse de que 'canciones' sea siempre un array
      const cancionesArray = Array.isArray(canciones) ? canciones : [canciones];
      console.log("Canciones procesadas:", cancionesArray);

      // Separar ObjectId válidos y nombres
      const objectIds = [];
      const nombresCanciones = [];
      
      cancionesArray.forEach((cancion) => {
        if (mongoose.Types.ObjectId.isValid(cancion)) {
          objectIds.push(cancion); // Es un ObjectId válido
        } else {
          nombresCanciones.push(cancion); // Es un nombre
        }
      });

      console.log("IDs detectados:", objectIds);
      console.log("Nombres detectados:", nombresCanciones);

      // Buscar las canciones por `_id` o `nombre`
      const cancionesEncontradas = await Canciones.find({
        $or: [{ _id: { $in: objectIds } }, { nombre: { $in: nombresCanciones } }],
      });

      console.log("Canciones encontradas:", cancionesEncontradas);

      // Validar existencia del usuario
      const usuarioEncontrado = await Usuario.findOne({ _id: creadoPor });
      console.log("Usuario encontrado:", usuarioEncontrado);

      if (!usuarioEncontrado) {
        return res
          .status(400)
          .json({ message: `No se encontró el usuario: ${creadoPor}` });
      }

      if (cancionesEncontradas.length === 0) {
        const nuevasCanciones = await Canciones.insertMany(
          cancionesArray.map(cancion => ({ cancion })) // Crear objetos con el formato adecuado
        );

        console.log("🎶 Nuevas canciones creadas:", nuevasCanciones);

        cancionesEncontradas.push(...nuevasCanciones); // Agregar las nuevas canciones al array
      }

      // Crear la nueva playlist
      const nuevaPlaylist = new PlayList({
        canciones: cancionesEncontradas.map((c) => c._id), // Guardar los `_id` encontrados
        creadoPor: usuarioEncontrado._id,
        nombre,
      });

      console.log("Nueva playlist a guardar:", nuevaPlaylist);

      // Guardar la playlist en la base de datos
      await nuevaPlaylist.save();
      res.status(201).json({
        message: "Playlist guardada con éxito",
        playlist: nuevaPlaylist,
      });
    } catch (error) {
      console.error("Error al guardar la playlist:", error.message);
      res.status(500).json({
        message: "Error al guardar la playlist",
        error: error.message,
      });
    }
  };



  export async function agregarCancion(req, res) {
    const { id } = req.params; // Playlist ID de la URL
    const { canciones } = req.body; // Canciones desde el body

    if (!canciones || !Array.isArray(canciones)) {
        return res.status(400).json({ mensaje: "Formato de canciones inválido" });
    }

    try {
      const playlist = await PlayList.findById(id);
        if (!playlist) {
            return res.status(404).json({ mensaje: "Playlist no encontrada" });
        }

        playlist.canciones.push(...canciones);
        await playlist.save();

        res.json({ mensaje: "✅ Canción(es) agregada(s) a la playlist", playlist });
    } catch (error) {
        console.error("❌ Error al agregar canción:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

export const listar = async (req, res) => {
  try {
    const playlist = await PlayList.find();
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error al obtener las canciones", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la playlist", error: error.message });
  }
};

export const ObtenerPorId = async (req, res) => {
  // const { id } = req.params;
  // if (!mongoose.Type.ObjectId.isValid(id)) {
  //   return res.status(400).json({ message: "ID no valido" });
  // }
  const id = new mongoose.Types.ObjectId(req.params.id);
  try {
    const playlist = await PlayList.findById(id);

    if (!playlist) {
      return res.status(400).json({ message: "playlist no encontrado" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error al obtener la cancion", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la playlist", error: error.message });
  }
};

export const Actualizar = async (req, res) => {
  const { id } = req.params;
  let { canciones, nombre, descripcion, creadoPor } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de playlist no válido" });
    }

    if (!creadoPor || typeof creadoPor !== "string") {
      return res
        .status(400)
        .json({ message: "El campo 'creadoPor' debe ser un nombre válido" });
    }

    const usuarioEncontrado = await Usuario.findOne({ nombre: creadoPor });
    if (!usuarioEncontrado) {
      return res
        .status(400)
        .json({ message: `No se encontró el usuario con ID: ${creadoPor}` });
    }
    creadoPor = usuarioEncontrado._id;

    console.log("👤 Usuario encontrado:", usuarioEncontrado);

    const cancionesArray = Array.isArray(canciones)
      ? canciones
      : canciones
        ? [canciones]
        : [];

        if (cancionesArray.length === 0) {
          return res.status(400).json({ message: "Debes proporcionar al menos una canción" });
        }
        const cancionesComoID = cancionesArray.filter(c => mongoose.Types.ObjectId.isValid(c));
        const cancionesComoNombre = cancionesArray.filter(c => !mongoose.Types.ObjectId.isValid(c));
    
        console.log("🎵 IDs detectados:", cancionesComoID);
        console.log("🎵 Nombres detectados:", cancionesComoNombre);
    
        // 🔹 Buscar canciones por nombre y obtener sus _id
        const cancionesPorNombre = await Canciones.find({ cancion: { $in: cancionesComoNombre } }, "_id cancion");
    
        // 🔹 Unir los ObjectId obtenidos
        const cancionesIds = [
          ...cancionesComoID,
          ...cancionesPorNombre.map(c => c._id)
        ];
    
    if (cancionesIds.length === 0) {
      return res.status(400).json({ message: "No se encontraron las canciones proporcionadas" });
    }
    console.log("🎵 Canciones encontradas:", cancionesIds);

    const playlistExistente = await PlayList.findOne({ _id: id, creadoPor });
    if (!playlistExistente) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    const cancionesRepetidas = cancionesIds.filter((cancionId) =>
        playlistExistente.canciones.some((c) => c.toString() === cancionId.toString())
      );
    if (cancionesRepetidas.length > 0) {
      return res
        .status(400)
        .json({
          message: `Las siguientes canciones ya están en la playlist: ${cancionesRepetidas.join(
            ", "
          )}`,
        });
    }

    const cancionesNuevas = cancionesIds.filter(
      (cancionId) =>!playlistExistente.canciones.includes(cancionId.toString())
    );

    if (cancionesNuevas.length === 0){
      return res.status(400).json({
        message:"Todas las canciones ya estan en la playlist",
      })
    }

     await PlayList.findByIdAndUpdate(
      id,
      {
        $addToSet: {canciones:{$each: cancionesNuevas}},
        nombre,
        descripcion,
      },
      { new: true }
    );

    const playlistActualizada = await PlayList.findById(id).populate("canciones")
    console.log("📀 Playlist actualizada:", playlistActualizada);

    res.status(200).json(playlistActualizada);
  } catch (error) {
    console.error("❌ Error al actualizar la playlist:", error.message);
    res
      .status(500)
      .json({ message: "Error al actualizar playlist", error: error.message });
  }
};

export const Eliminar = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: " ID no valido" });
  }
  try {
    const playlistEliminada = await PlayList.findByIdAndDelete(id);

    if (!playlistEliminada) {
      return res.status(404).json({ message: "playlsit no encontrada" });
    }
    res.status(200).json({ message: "playlist eliminada con exito" });
  } catch (error) {
    console.error("error al eliminra la playlsit", error.message);
    res
      .status(500)
      .json({ message: "Error al eliminar la cancion", error: error.message });
  }
};

export default { crear, agregarCancion,listar, ObtenerPorId, Actualizar, Eliminar };

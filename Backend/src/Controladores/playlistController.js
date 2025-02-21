import playList from "../Modelos/playlistModelos.js";
import Canciones from "../Modelos/cancionesModelos.js";
import Usuario from "../Modelos/usuariosModelos.js";
import mongoose from "mongoose";

export const crear = async (req, res) => {
  try {
    const { creadoPor, canciones, nombre, descripcion } = req.body;

    console.log("Datos recibidos:", {
      creadoPor,
      canciones,
      nombre,
      descripcion,
    });

    // Asegurarse de que 'canciones' sea siempre un array
    const cancionesArray = Array.isArray(canciones) ? canciones : [canciones];
    console.log("Canciones procesadas:", cancionesArray);

    // Buscar las canciones en la base de datos usando el campo 'cancion'
    const cancionesEncontradas = await Canciones.find({
      cancion: { $in: cancionesArray },
    });
    console.log("Canciones encontradas:", cancionesEncontradas);

    const usuarioEncontrado = await Usuario.findOne({
      nombre: new RegExp(`^${creadoPor}$`, "i"),
    });
    console.log("Usuario encontrado:", usuarioEncontrado);

    if (!usuarioEncontrado) {
      return res
        .status(400)
        .json({ message: `No se encontró el usuario: ${creadoPor}` });
    }
    if (cancionesEncontradas.length === 0) {
      return res
        .status(400)
        .json({
          message: `No se encontraron las canciones: ${cancionesArray.join(
            ", "
          )}`,
        });
    }
    // const playlistExistente = await playList.findOne({ creadoPor: usuarioEncontrado._id, nombre });

    // if (playlistExistente) {
    //     const cancionesEnPlaylist = playlistExistente.canciones.map(c => c.toString());
    //     const cancionesRepetidas = cancionesEncontradas.filter(c => cancionesEnPlaylist.includes(c._id.toString()));

    //     if (cancionesRepetidas.length > 0) {
    //         return res.status(400).json({ message: `Las siguientes canciones ya están en la playlist: ${cancionesRepetidas.map(c => c.cancion).join(", ")}` });
    //     }
    // }

    // Crear la nueva playlist
    const nuevaPlaylist = new playList({
      canciones: cancionesEncontradas.map((c) => c._id), // Guardar los _id de las canciones encontradas
      creadoPor: usuarioEncontrado._id,
      nombre,
      descripcion,
    });

    console.log("Nueva playlist a guardar:", nuevaPlaylist);

    // Guardar la playlist en la base de datos
    await nuevaPlaylist.save();
    res
      .status(201)
      .json({
        message: "Playlist guardada con éxito",
        playlist: nuevaPlaylist,
      });
  } catch (error) {
    console.error("Error al guardar la playlist:", error.message);
    res
      .status(500)
      .json({ message: "Error al guardar la playlist", error: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const Playlist = await playList.find();
    res.status(200).json(Playlist);
  } catch (error) {
    console.error("Error al obtener las canciones", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la playlist", error: error.message });
  }
};

export const ObtenerPorId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Type.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no valido" });
  }
  try {
    const Playlist = await playList.findById(id);

    if (!Playlist) {
      return res.status(400).json({ message: "playlist no encontrado" });
    }

    res.status(200).json(playList);
  } catch (error) {
    console.error("Error al obtener la cancion", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la playlisy", error: error.message });
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

    const cancionesArray = Array.isArray(canciones) ? canciones : [canciones];

    const cancionesEncontradas = await Canciones.find(
      { cancion: { $in: cancionesArray } },
      "_id"
    );
    if (cancionesEncontradas.length === 0) {
      return res
        .status(400)
        .json({
          message: `No se encontraron las canciones: ${canciones.join(", ")}`,
        });
    }

    const cancionesIds = cancionesEncontradas.map((c) => c._id);

    console.log("🎵 Canciones encontradas:", cancionesIds);

    const playlistExistente = await playList.findOne({ _id: id, creadoPor });
    if (!playlistExistente) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    const cancionesRepetidas = playlistExistente.canciones
      .map((c) => c.toString())
      .filter((c) => cancionesIds.includes(c));
    if (cancionesRepetidas.length > 0) {
      return res
        .status(400)
        .json({
          message: `Las siguientes canciones ya están en la playlist: ${cancionesRepetidas.join(
            ", "
          )}`,
        });
    }

    const playlistActualizada = await playList.findByIdAndUpdate(
      id,
      {
        canciones: [...playlistExistente.canciones, ...cancionesIds],
        nombre,
        descripcion,
      },
      { new: true }
    );

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
    const playlistEliminada = await playList.findByIdAndDelete(id);

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

export default { crear, listar, ObtenerPorId, Actualizar, Eliminar };

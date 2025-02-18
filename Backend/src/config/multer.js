import multer from "multer";
import path from "path";
import fs from "fs";

// Definir la carpeta de almacenamiento de archivos
const uploadDir = path.resolve("public/uploads");

// Verificar si la carpeta de uploads existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
    console.log("Creando carpeta de uploads en:", uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log("Carpeta de uploads ya existe:", uploadDir);
}

// Configuración del almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Guardando archivo en:", uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        console.log("Nombre del archivo:", uniqueSuffix);
        cb(null, uniqueSuffix);
    }
});

// Filtro para aceptar solo imágenes y archivos de audio
const fileFilter = (req, file, cb) => {
    console.log("Tipo de archivo:", file.mimetype);
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        console.error("Error: Tipo de archivo no permitido");
        cb(new Error("Solo se permiten imágenes y archivos de audio"), false);
    }
};

// Configurar multer para múltiples archivos
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
// Función para guardar la imagen después de ser subida
export const saveImage = (file) => {
    const newPath = path.join(uploadDir, file.originalname);
    try {
        fs.renameSync(file.path, newPath);
        return newPath;
    } catch (error) {
        console.error("Error al mover el archivo:", error);
        throw new Error("No se pudo guardar la imagen");
    }
};


export default upload;

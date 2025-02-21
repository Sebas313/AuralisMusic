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
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        cb(new Error("❌ Solo se permiten imágenes y archivos de audio."), false);
    }
};


// Configurar multer para múltiples archivos
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;

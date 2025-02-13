import multer from "multer";
import path from "path";
import fs from "fs";

// Asegurar que la carpeta de uploads existe
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
    console.log("creando carpeta de uploads en:",uploadDir)
    fs.mkdirSync(uploadDir, { recursive: true });
}else {
    console.log(" Carpeta de uploads ya existe:", uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Guardando en:", uploadDir);
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        console.log("Nombre del archivo:", uniqueSuffix);
        cb(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    console.log("Tipo de archivo:", file.mimetype);
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        console.error(" Error: No es un archivo de imagen");
        cb(new Error("No es un archivo de imagen"), false);
    }
};

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

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    
});

export default upload;

export interface Cancion {
    _id: string;
    cantante: {
      _id: string;
      nombre: string;
    };
    album: string;
    genero: string;
    imagen: string;
    fileUrl: string;
  }
  
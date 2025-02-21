export interface User {
  _id: string;       // Identificador único del usuario
  firstname: string; // Nombre del usuario
  lastname: string;  // Apellido del usuario
  email: string;     // Correo electrónico del usuario
  avatar?: string;   // Foto de perfil del usuario (opcional)
  rol: string;       // Rol del usuario (admin, usuario, cantante, moderador, editor)
  isVerified: boolean; // Indica si el correo del usuario ha sido verificado (default: false en el registro)
}

export interface RegisterData {
  email: string;     // Correo electrónico del usuario
  password: string;  // Contraseña del usuario
}

export interface RegisterResponse {
  user: User;        // Usuario recién registrado
  token: string;     // Token JWT para autenticación
}

export interface LoginResponse {
  token: string;     // Token JWT para autenticación
  user: User;        // Información del usuario, incluyendo la propiedad isVerified
}

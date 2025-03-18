
export const verificarRoles = (rolesPermitidos) => {
  return (req, res, next) => {
      if (!req.usuario) {
          return res.status(401).json({ message: "No hay usuario en la petición" });
      }

      const { rol } = req.usuario;
      if (!rol) {
          return res.status(403).json({ message: "El usuario no tiene un rol definido" });
      }

      if (!rolesPermitidos.includes(rol)) {
          return res.status(403).json({ message: "Acceso denegado" });
      }

      next();
  };
};

export default verificarRoles;

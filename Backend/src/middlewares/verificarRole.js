export const verificarRoles = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    };
  };

  export default verificarRoles
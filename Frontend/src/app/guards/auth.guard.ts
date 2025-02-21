import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    let userRole = localStorage.getItem('userRol'); // ✅ Se usa 'userRol' en lugar de 'userRole'

    console.log("🔎 Verificando acceso...");
    console.log("Token:", token);
    console.log("Rol en localStorage:", userRole);

    // Si no hay token, redirige al login
    if (!token) {
      console.log("🚫 No hay token, redirigiendo a login...");
      this.router.navigateByUrl('/login');
      return false;
    }

    // Intentar obtener el rol desde el objeto user si es null
    if (!userRole) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userRole = user.rol;
          localStorage.setItem('userRol', userRole); // ✅ Guarda el rol nuevamente para evitar futuros problemas
        } catch (error) {
          console.error("❌ Error al parsear el usuario desde localStorage:", error);
          this.router.navigateByUrl('/login');
          return false;
        }
      }
    }

    // Lista de roles permitidos
    const rolesPermitidos = ['admin', 'usuario', 'cantante', 'moderador', 'editor'];

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      console.log("🚫 Rol inválido, redirigiendo a login...");
      this.router.navigateByUrl('/login');
      return false;
    }

    console.log("✅ Acceso permitido a:", userRole);
    return true;
  }
}

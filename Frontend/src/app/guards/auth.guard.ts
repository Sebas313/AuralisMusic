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


    // Si no hay token, redirige al login
    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }


    if (!userRole) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userRole = user.rol;
          localStorage.setItem('userRol', userRole); 
        } catch (error) {
          console.error("❌ Error al parsear el usuario desde localStorage:", error);
          this.router.navigateByUrl('/login');
          return false;
        }
      }
    }


    const rolesPermitidos = ['admin', 'usuario', 'cantante', 'moderador', 'editor'];

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}

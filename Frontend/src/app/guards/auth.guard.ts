import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken'); // Verifica si hay token
    const userRole = localStorage.getItem('userRole'); // Obtiene el rol del usuario

    if (token) {
      // ✅ Si hay token, verifica el rol
      if (userRole === 'admin') {
        this.router.navigate(['/admin-dashboard']); // Redirige si es admin
      } else if (userRole === 'user') {
        this.router.navigate(['/home']); // Redirige si es usuario normal
      } else {
        this.router.navigate(['/login']); // Si no hay rol válido, redirige al login
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']); // ⛔ Redirige si no hay token
      return false;
    }
  }
}

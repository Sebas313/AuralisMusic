import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CantanteGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      this.router.navigate(['/register']); // Si no hay sesión, redirige al registro
      return false;
    }

    const userRole = JSON.parse(user).rol; // Obtener rol del usuario

    if (userRole !== 'cantante') {
      this.router.navigate(['/']); // Si no es cantante, redirige al home
      return false;
    }

    return true; // Si es cantante, permite el acceso
  }
}

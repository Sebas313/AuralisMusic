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
      console.warn('🚫 No hay sesión. Redirigiendo a /register');
      this.router.navigate(['/register']);
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);

      if (!parsedUser.rol) {
        console.error('⚠️ Error: El usuario no tiene rol definido.');
        this.router.navigate(['/']);
        return false;
      }

      if (parsedUser.rol.trim().toLowerCase() !== 'cantante') {
        console.warn('🚫 Acceso denegado. El usuario no es cantante.');
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } catch (error) {
      console.error('❌ Error al procesar el usuario desde localStorage:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}

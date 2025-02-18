import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log("🚫 No hay token, redirigiendo a registro...");
      this.router.navigate(['/register']);
      return false; // ⛔ Bloquea el acceso si no hay sesión iniciada
    }

    return true; // ✅ Permite el acceso si hay sesión
  }
}

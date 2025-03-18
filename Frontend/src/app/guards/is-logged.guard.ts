import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Si el usuario tienen un token, le podemos dar paso...
  if (localStorage.getItem('user_token')) {
    return true;
  } else {
    // Sino, lo redirigimos a login y responsemos false...
    router.navigate(['/login']);
    return false;
  }
};
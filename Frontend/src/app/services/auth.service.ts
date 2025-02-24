import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { API_URL } from '../../config'; // ✅ Importa la URL desde config.ts

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_URL}/Api`;
  private authStatus = new BehaviorSubject<boolean>(this.isLogged()); // Estado inicial basado en localStorage
  isLogged$ = this.authStatus.asObservable(); // Observable para actualizar la UI en tiempo real

  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem('user_token', token);
    this.authStatus.next(true); // 🚀 Notifica que el usuario está autenticado
  }

  removeToken(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    this.authStatus.next(false); // ❌ Notifica que el usuario cerró sesión
  }

  getToken(): string | null {
    const token = localStorage.getItem('user_token');
    console.log('🔑 Token desde localStorage:', token); // Ahora sí se ejecutará
    return token;
  }
  

  isLogged(): boolean {
    return !!localStorage.getItem('user_token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  logout(): void {
    this.removeToken(); 
    this.authStatus.next(false); 
    this.router.navigate(['/login']); 
  }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('📥 Respuesta del servidor:', response);
  
        if (!response?.token || !response?.user) {
          console.error('⚠️ Error: No se recibió token o usuario en la respuesta.');
          throw new Error('No se pudo autenticar el usuario.');
        }
  
        if (!response.user.isVerified) {
          console.warn('⚠️ El correo aún no ha sido verificado.');
          this.router.navigate(['/verificar-email'], { queryParams: { email: response.user.email } });
          throw new Error('El correo aún no ha sido verificado.');
        }
  
        console.log('✅ Usuario verificado, iniciando sesión.');
  
      
        this.setToken(response.token);
  
    
        const userData = {
          _id: response.user._id || 'SIN_ID',
          nombre: response.user.nombre || 'Desconocido',
          email: response.user.email || 'Sin correo',
          rol: response.user.rol?.trim().toLowerCase() || 'usuario' 
        };
  
        localStorage.setItem('user', JSON.stringify(userData));
  
        console.log('✅ Usuario guardado en localStorage:', userData);
  
     
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.error('❌ Error en login:', error);
  
        let errorMessage = 'Error al iniciar sesión.';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  

  
  

 
  
 

    
}

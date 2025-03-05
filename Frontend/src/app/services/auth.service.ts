import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Api`;
  private authStatus = new BehaviorSubject<boolean>(this.isLogged()); 
  isLogged$ = this.authStatus.asObservable(); 

  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem('user_token', token);
    this.authStatus.next(true);
  }

  removeToken(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    this.authStatus.next(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem('user_token');
    console.log('🔑 Token desde localStorage:', token); 
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

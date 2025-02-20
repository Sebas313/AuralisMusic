import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'http://localhost:3000/Api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  register(registerData: { nombre: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Registro`, registerData).pipe(
      tap((response: RegisterResponse) => {
        if (response?.user?._id && response.token) {
          localStorage.setItem('userId', response.user._id);
          this.authService.setToken(response.token);
        }
      }),
      catchError(this.handleError<RegisterResponse>('Error al registrar el usuario'))
    );
  }
  
  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verificar-email?token=${token}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }).pipe(
      tap(response => {
        console.log('📥 Respuesta del backend (verificación de email):', response);
        if (response?.success && response?.token && response?.user) {
          console.log('🔑 Token válido. Redirigiendo al home...');
          localStorage.setItem('authToken', response.token); // Guarda el token
          // Redirige al home
          window.location.href = '/home';
        } else {
          console.log('⚠️ Token inválido o expirado');
        }
      })
    );
  }
  

  

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response?.token) {
          this.authService.setToken(response.token);
        }
      }),
      catchError(this.handleError<LoginResponse>('Error al iniciar sesión'))
    );
  }

  logout(): void {
    this.authService.removeToken();
  }


  isLogged(): boolean {
    return this.authService.isLogged();
  }

  fetchUserProfile(userId: string) {
    return this.http.get<any>(`/usuario/${userId}`).pipe(
      map(response => {
        console.log('Response:', response);  // Verifica la estructura aquí
        return response; // Retorna la respuesta completa o solo las propiedades necesarias
      })
    );
  }
  uploadProfilePhoto(formData: FormData): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.put<any>(`${this.apiUrl}/usuario${userId}/avatar`, formData);
  }

  private handleError<T>(defaultMessage: string) {
    return (error: any): Observable<T> => {
      console.error("Error completo:", error);
      const errorMessage = error.error ? JSON.stringify(error.error) : defaultMessage;
      return throwError(() => new Error(errorMessage));
    };
  }
  
}
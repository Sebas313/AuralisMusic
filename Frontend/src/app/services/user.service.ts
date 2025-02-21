import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'http://localhost:3000/Api';
  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private router: Router
  ) {}
  

  register(registerData: RegisterData): Observable<RegisterResponse> {
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
    return this.http.get<any>(`${this.apiUrl}/verificar/${token}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap(response => {
        console.log('📥 Respuesta del backend (verificación de email):', response);
  
        if (response?.success && response?.token && response?.user) {
          console.log('🔑 Token válido. Guardando datos del usuario...');
  
          // ✅ Guarda el token y el rol en localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify({
            _id: response.user._id,
            nombre: response.user.nombre,
            email: response.user.email,
            rol: response.user.rol || 'usuario' // 👀 Guarda el rol del usuario
          }));
  
          console.log('✅ Usuario guardado en localStorage:', JSON.parse(localStorage.getItem('user')!));
          console.log('🎭 Rol del usuario:', response.user.rol);
  
          // ✅ Redirige al home solo si tiene el rol adecuado
          if (response.user.rol === 'admin' || response.user.rol === 'usuario') {
            this.router.navigate(['/home']);
          } else {
            console.warn('🚫 Acceso denegado: Rol no autorizado');
            this.router.navigate(['/login']); // O a una página de acceso denegado
          }
        } else {
          console.log('⚠️ Token inválido o expirado');
          this.router.navigate(['/register']); // Redirige si la verificación falla
        }
      }),
      catchError(error => {
        console.error('❌ Error en la verificación del email:', error);
        return throwError(() => new Error('Error al verificar el email.'));
      })
    );
  }
  
  
  




  fetchUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${userId}`).pipe(
      map(response => {
        console.log('Response:', response);
        return response;
      }),
      catchError(this.handleError<any>('Error al obtener el perfil'))
    );
  }

  uploadProfilePhoto(formData: FormData): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.put<any>(`${this.apiUrl}/usuario/${userId}/avatar`, formData).pipe(
      catchError(this.handleError<any>('Error al subir la foto de perfil'))
    );
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuario/${userId}/rol`, { role }).pipe(
      tap(response => console.log('Rol actualizado:', response)),
      catchError(this.handleError<any>('Error al actualizar el rol'))
    );
  }

  private handleError<T>(defaultMessage: string) {
    return (error: any): Observable<T> => {
      console.error("Error completo:", error); // Ver todo el error
      console.log("Error status:", error.status); // Ver código de estado HTTP
      console.log("Error body:", error.error); // Ver mensaje del backend
      
      const errorMessage = error.error ? JSON.stringify(error.error) : defaultMessage;
      return throwError(() => new Error(errorMessage));
    };
  }
 
}

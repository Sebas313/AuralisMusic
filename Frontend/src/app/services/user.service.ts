import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = `${environment.apiUrl}/Api`;
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
  
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify({
            _id: response.user._id,
            nombre: response.user.nombre,
            email: response.user.email,
            rol: response.user.rol || 'usuario', 
          }));
  
       
  
          // Redirige según el entorno
          const redirectUrl = environment.production
            ? `${environment.frontendUrl}/login`
            : '/login'; 
          console.log(environment.frontendUrl)
          console.log("Redirigiendo a:", redirectUrl); 
          setTimeout(() => {  
            this.router.navigate([redirectUrl]);
          }, 500);
  
        } else {
          this.router.navigate(['/register']);
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
        return response;
      }),
      catchError(this.handleError<any>('Error al obtener el perfil'))
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
      const errorMessage = error.error ? JSON.stringify(error.error) : defaultMessage;
      return throwError(() => new Error(errorMessage));
    };
  }
 
}

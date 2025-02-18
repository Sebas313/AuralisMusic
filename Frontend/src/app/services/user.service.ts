import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

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

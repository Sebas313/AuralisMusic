import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/Api'; // URL de tu API

  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem('user_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('user_token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

 /*  register(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    return this.http.post<any>(`${this.apiUrl}/registro`, { email, password }, { headers }).pipe(
      tap((response: any) => {
        if (response.success) {
          // Redirige a la página de verificación con el email como parámetro
          this.router.navigate(['/verificar-codigo'], { queryParams: { email } });
        }
      })
    );
  } */
  /* verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verificar-codigo`, { email, code });
  } */
  
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/Login`, { email, password }, { headers }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token); 
          localStorage.setItem('userId', response.user._id); 
          localStorage.setItem('userAvatar', response.user.avatar); 
        }
      })
    );
  }
}
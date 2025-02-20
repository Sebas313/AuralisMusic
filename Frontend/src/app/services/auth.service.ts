import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/Api'; // URL de tu API
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
    this.removeToken(); // 🔹 Usa la función removeToken() que ya limpia todo
    this.authStatus.next(false); // 🚀 Notifica a la UI que cerró sesión
    this.router.navigate(['/login']); // 🔄 Redirige al login
  }
  


 /*  register(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/registro`, { email, password }, { headers }).pipe(
      tap((response: any) => {
        if (response.success) {
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

  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verificar-codigo`, { email, code });
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('📥 Respuesta completa del servidor:', response);

        if (response.token) {
          this.setToken(response.token);

          if (response.user) {
            console.log('👤 Datos del usuario:', response.user);

            localStorage.setItem('user', JSON.stringify({
              _id: response.user._id || 'SIN_ID',
              nombre: response.user.nombre,
              email: response.user.email
            }));

            console.log('✅ Usuario guardado en localStorage:', JSON.parse(localStorage.getItem('user')!));
          } else {
            console.error('⚠️ Error: No se encontró la propiedad "user" en la respuesta.');
          }
        }
      })
    );
  }
}

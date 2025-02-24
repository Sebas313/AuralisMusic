// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config'; // 

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${API_URL}/Api/Usuario/`;
  constructor(private http: HttpClient) { }

  // Obtener el perfil del usuario
  getUserProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`); 
  }
  editProfilePhoto(userId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuario/${userId}/avatar`, formData);
  }
}


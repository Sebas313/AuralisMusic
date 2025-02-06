import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'https://localHost:3000/Api/song'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

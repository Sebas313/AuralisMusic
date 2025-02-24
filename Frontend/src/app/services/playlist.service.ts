import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../config'; // ✅ Importa la URL desde config.ts

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${API_URL}/Api/Playlist`;
  private http = inject(HttpClient);
  url: any;

  getPlaylists(): Observable<any[]> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
  
    if (!user || !user._id) {
      throw new Error('Usuario no autenticado');
    }
  
    return this.http.get<any[]>(`${this.apiUrl}?creadoPor=${user._id}`);

  }
  

  addSongToPlaylist(playlistName: string, song: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${playlistName}/canciones`, song);

  }

  createPlaylist(playlist: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?._id; // 👉 Obtén el ID del usuario
  
    if (!userId) {
      throw new Error('ID de usuario no encontrado');
    }
  
    // 👉 Configura las cabeceras (sin token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    // 📂 Incluye el userId en el cuerpo de la playlist
    const playlistWithUser = {
      ...playlist,
      creadoPor: userId // 👈 Añade el ID al objeto enviado
    };
  
    // 📡 Realiza la petición POST
    return this.http.post(`${this.apiUrl}`, playlistWithUser, { headers });
  }


  guardarPlaylist(playlistData: any): Observable<any> {
    return this.http.post <any>(`${this.apiUrl}`, playlistData);
  }
  
}

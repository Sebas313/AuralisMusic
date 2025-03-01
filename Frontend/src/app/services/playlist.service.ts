import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Solo importamos lo que usamos

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${environment.apiUrl}/Api/Playlist`; 
  private http = inject(HttpClient);

  // Este método obtiene todas las playlists del usuario
  getPlaylists(): Observable<any[]> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
  
    if (!user || !user._id) {
      throw new Error('Usuario no autenticado');
    } 
  
    return this.http.get<any[]>(`${this.apiUrl}?creadoPor=${user._id}`).pipe(
      tap(playlists => console.log("🎵 Playlists recibidas:", playlists)),
      catchError(err => {
        console.error('❌ Error al obtener playlists:', err);
        return throwError(() => err);
      })
    );
  }
  
  // Este método obtiene una playlist específica por ID
  getPlaylist(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log("📡 Solicitando playlist en:", url);
    return this.http.get<any>(url).pipe(
      tap(playlist => console.log("🎵 Playlist recibida:", playlist)),
      catchError(err => {
        console.error(`❌ Error al obtener la playlist con ID ${id}:`, err);
        return throwError(() => err);
      })
    );
  }
  
  
 addSongToPlaylist(playlistId: string, song: any): Observable<any> {
    const body = { 
      canciones: [song._id] // Solo enviamos la lista de canciones
    };
    
    const url = `${this.apiUrl}/${playlistId}`; // Ahora sí incluimos el ID en la URL
    
    return this.http.post<any>(url, body).pipe(
      tap(response => console.log("✅ Canción agregada a la playlist:", response)),
      catchError(err => {
        console.error('❌ Error al agregar canción a la playlist:', err);
        return throwError(() => err);
      })
    );
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
    return this.http.post(`${this.apiUrl}`, playlistWithUser, { headers }).pipe(
      tap(response => console.log("✅ Playlist creada:", response)),
      catchError(err => {
        console.error('❌ Error al crear playlist:', err);
        return throwError(() => err);
      })
    );
  }

  guardarPlaylist(playlistData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, playlistData).pipe(
      tap(response => console.log("✅ Playlist guardada:", response)),
      catchError(err => {
        console.error('❌ Error al guardar playlist:', err);
        return throwError(() => err);
      })
    );
  }
}
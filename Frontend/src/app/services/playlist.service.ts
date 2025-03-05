import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${environment.apiUrl}/Api/Playlist`; 
  private http = inject(HttpClient);

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
      canciones: [song._id] 
    };
    
    const url = `${this.apiUrl}/${playlistId}`; 
    
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
    const userId = user?._id; 
  
    if (!userId) {
      throw new Error('ID de usuario no encontrado');
    }
  

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  

    const playlistWithUser = {
      ...playlist,
      creadoPor: userId
    };
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
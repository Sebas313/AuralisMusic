import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Cancion {
  id: number;
  cancion: string;
  cantante: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:3000/Api/Canciones'; // Ajusta la URL según tu backend
  private playlist: Cancion[] = [];

  // BehaviorSubject para que los cambios se reflejen en tiempo real
  private playlistSubject = new BehaviorSubject<Cancion[]>(this.playlist);
  playlist$ = this.playlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * 📤 Subir una canción (imagen + archivo de audio)
   */
  uploadCancion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  /**
   * 📜 Obtener todas las canciones
   */
  getCanciones(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(this.apiUrl);
  }

  /**
   * 🔹 Generar Headers con Token
   */
  private getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    // Solo agregar Content-Type si NO es FormData
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  /**
   * 📜 Obtener todas las canciones
   */
  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  /**
   * 🔎 Obtener una canción por ID
   */
  getSongById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * 📤 Subir una canción con autenticación
   */
  subirCancion(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No estás autenticado.'));
    }

    return this.http.post<any>(this.apiUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  /**
   * ✏️ Actualizar una canción por ID
   */
  updateSong(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` })
    });
  }

  /**
   * ❌ Eliminar una canción por ID
   */
  deleteSong(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * 🔎 Obtener una canción por ID (versión con `Cancion`)
   */
  getCancionById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.apiUrl}/${id}`);
  }

  /**
   * 🗑️ Eliminar una canción de la playlist
   */
  removeFromPlaylist(cancion: Cancion) {
    this.playlist = this.playlist.filter(item => item.id !== cancion.id);
    this.playlistSubject.next(this.playlist); // Actualiza el observable
    console.log('Canción eliminada:', cancion);
  }
}

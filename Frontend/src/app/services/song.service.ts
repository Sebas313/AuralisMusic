import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Cancion } from '../models/cancion.model';
import { API_URL } from '../../config'; // ✅ Importa la URL desde config.ts
import { environment } from '../../environments/environment'; // 👈 Importa desde environments

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private apiUrl = `${environment.apiUrl}/Api/Canciones`; // 👈 Usa environment.apiUrl

  private playlist: Cancion[] = [];

  private playlistSubject = new BehaviorSubject<Cancion[]>(this.playlist);
  playlist$ = this.playlistSubject.asObservable();

  // 🔹 Estado de la canción actual y reproducción
  private currentSongSource = new BehaviorSubject<Cancion | null>(null);
  currentSong$ = this.currentSongSource.asObservable();

  private isPlayingSource = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSource.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * 📜 Obtener todas las canciones
   */
  getCanciones(): Observable<Cancion[]> {
    return this.http
      .get<Cancion[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * 🔎 Obtener una canción por ID
   */
  getCancionById(id: string): Observable<Cancion> {
    return this.http
      .get<Cancion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * 🎵 Obtener la URL de audio de una canción
   */
  getSongAudioUrl(id: string): Observable<string> {
    return this.getCancionById(id).pipe(
      map((song) => {
        if (!song.fileUrl) throw new Error('Esta canción no tiene un archivo de audio.');
        return song.fileUrl;
      }),
      catchError((error) => {
        console.error('Error obteniendo la URL de la canción:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 🚀 Subir una nueva canción
   */
  subirCancion(formData: FormData): Observable<Cancion> {
    return this.http
      .post<Cancion>(this.apiUrl, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * ✏️ Actualizar una canción por ID
   */
  updateSong(id: string, formData: FormData): Observable<Cancion> {
    return this.http
      .put<Cancion>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * ❌ Eliminar una canción por ID
   */
  deleteSong(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * 🗑️ Eliminar una canción de la playlist
   */
  removeFromPlaylist(cancion: Cancion) {
    if (!cancion._id) {
      console.error('La canción no tiene un ID válido:', cancion);
      return;
    }

    this.playlist = this.playlist.filter((item) => item._id !== cancion._id);
    if (this.playlist.length === 0) {
      this.playlistSubject.next([]); // Asegura que se notifique cuando la playlist esté vacía
    } else {
      this.playlistSubject.next(this.playlist);
    }
    console.log('Canción eliminada:', cancion);
  }

  /**
   * 🎼 Establecer la canción actual
   */
  setCurrentSong(song: Cancion) {
    this.currentSongSource.next(song);
  }

  /**
   * ▶️ Cambiar el estado de reproducción
   */
  setIsPlaying(state: boolean) {
    this.isPlayingSource.next(state);
  }

  /**
   * ⏮️ Ir a la canción anterior
   */
  prevSong() {
    const currentSong = this.currentSongSource.getValue();
    if (!currentSong || this.playlist.length === 0) return;

    const currentIndex = this.playlist.findIndex((song) => song._id === currentSong._id);
    if (currentIndex > 0) {
      this.setCurrentSong(this.playlist[currentIndex - 1]);
    } else {
      console.warn('Ya estás en la primera canción.');
    }
  }

  /**
   * ⏭️ Ir a la siguiente canción
   */
  nextSong() {
    const currentSong = this.currentSongSource.getValue();
    if (!currentSong || this.playlist.length === 0) return;

    const currentIndex = this.playlist.findIndex((song) => song._id === currentSong._id);
    if (currentIndex < this.playlist.length - 1) {
      this.setCurrentSong(this.playlist[currentIndex + 1]);
    } else {
      console.warn('Ya estás en la última canción.');
    }
  }

  /**
   * 🔀 Reproducir una canción aleatoria
   */
  playRandomSong() {
    if (this.playlist.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    const randomSong = this.playlist[randomIndex];

    this.setCurrentSong(randomSong); // Notifica a MusicPlayer
    this.setIsPlaying(true); // Inicia la reproducción
  }

  /**
   * 🔹 Generar Headers con Token
   */
  private getHeaders(isFormData: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  /**
   * ⚠️ Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => error);
  }
}

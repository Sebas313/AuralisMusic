import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Cancion } from '../models/cancion.model';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private apiUrl = `${environment.apiUrl}/Api/Canciones`; 

  private playlist: Cancion[] = [];

  private playlistSubject = new BehaviorSubject<Cancion[]>(this.playlist);
  playlist$ = this.playlistSubject.asObservable();

  private currentSongSource = new BehaviorSubject<Cancion | null>(null);
  currentSong$ = this.currentSongSource.asObservable();

  private isPlayingSource = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSource.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ Obtener todas las canciones
  getCanciones(): Observable<Cancion[]> {
    return this.http
      .get<Cancion[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Obtener canción por ID
  getCancionById(id: string): Observable<Cancion> {
    return this.http
      .get<Cancion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Obtener canciones por un listado de IDs
  getCancionesByIds(ids: string[]): Observable<Cancion[]> {
    const url = `${this.apiUrl}/canciones/getByIds`;
    return this.http
      .post<Cancion[]>(url, { ids }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Obtener canciones más escuchadas
  getMostPlayedSongs(): Observable<Cancion[]> {
    return this.http
      .get<Cancion[]>(`${this.apiUrl}/mas-escuchadas`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Obtener canciones más recientes
  getRecentSongs(): Observable<Cancion[]> {
    return this.http
      .get<Cancion[]>(`${this.apiUrl}/recientes`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Obtener la URL del archivo de audio de una canción
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

  // ✅ Subir una nueva canción
  subirCancion(formData: FormData): Observable<Cancion> {
    return this.http
      .post<Cancion>(this.apiUrl, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  // ✅ Editar una canción
  updateSong(id: string, formData: FormData): Observable<Cancion> {
    return this.http
      .put<Cancion>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }

  // ✅ Eliminar una canción
  deleteSong(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ Remover canción de la playlist
  removeFromPlaylist(cancion: Cancion) {
    if (!cancion._id) {
      console.error('La canción no tiene un ID válido:', cancion);
      return;
    }

    this.playlist = this.playlist.filter((item) => item._id !== cancion._id);
    if (this.playlist.length === 0) {
      this.playlistSubject.next([]); 
    } else {
      this.playlistSubject.next(this.playlist);
    }
    console.log('Canción eliminada:', cancion);
  }

  // ✅ Establecer la canción actual
  setCurrentSong(song: Cancion) {
    this.currentSongSource.next(song);
  }

  // ✅ Reproducir o pausar la música
  setIsPlaying(state: boolean) {
    this.isPlayingSource.next(state);
  }

  // ✅ Ir a la canción anterior
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

  // ✅ Ir a la siguiente canción
  nextSong() {
    this.getCanciones().subscribe((songs) => {
      if (songs.length === 0) return;
  
      const randomIndex = Math.floor(Math.random() * songs.length);
      const randomSong = songs[randomIndex];
  
      this.setCurrentSong(randomSong);
      this.setIsPlaying(true);
    });
  }
  

  // ✅ Reproducir una canción aleatoria
  playRandomSong() {
    if (this.playlist.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    const randomSong = this.playlist[randomIndex];

    this.setCurrentSong(randomSong);
    this.setIsPlaying(true); 
  }

  // ✅ Obtener headers para peticiones HTTP
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

  // ✅ Manejo de errores en peticiones HTTP
  private handleError(error: any): Observable<never> {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => error);
  }
}

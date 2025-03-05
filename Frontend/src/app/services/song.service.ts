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


   
  getCanciones(): Observable<Cancion[]> {
    return this.http
      .get<Cancion[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  getCancionById(id: string): Observable<Cancion> {
    return this.http
      .get<Cancion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  getCancionesByIds(ids: string[]): Observable<Cancion[]> {
    const url = `${this.apiUrl}/canciones/getByIds`;
    return this.http
      .post<Cancion[]>(url, { ids }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

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


  subirCancion(formData: FormData): Observable<Cancion> {
    return this.http
      .post<Cancion>(this.apiUrl, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }


  updateSong(id: string, formData: FormData): Observable<Cancion> {
    return this.http
      .put<Cancion>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders(true) })
      .pipe(catchError(this.handleError));
  }


  deleteSong(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  
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


  setCurrentSong(song: Cancion) {
    this.currentSongSource.next(song);
  }


  setIsPlaying(state: boolean) {
    this.isPlayingSource.next(state);
  }

 
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

  playRandomSong() {
    if (this.playlist.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    const randomSong = this.playlist[randomIndex];

    this.setCurrentSong(randomSong);
    this.setIsPlaying(true); 
  }

 
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

 
  private handleError(error: any): Observable<never> {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => error);
  }
}

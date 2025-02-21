import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

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

  uploadCancion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
  

  // Obtener todas las canciones
  getCanciones(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(this.apiUrl);
  }

  // Obtener canción por ID (opcional)
  getCancionById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.apiUrl}/${id}`);
  }

  removeFromPlaylist(cancion: Cancion) {
    this.playlist = this.playlist.filter(item => item.id !== cancion.id);
    this.playlistSubject.next(this.playlist); // Actualiza el observable
    console.log('Canción eliminada:', cancion);
  }

}


  




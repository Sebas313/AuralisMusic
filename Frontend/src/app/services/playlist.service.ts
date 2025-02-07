import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/Api/playlists';

  getPlaylists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addSongToPlaylist(playlistName: string, song: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${playlistName}/songs`, song);
  }
}

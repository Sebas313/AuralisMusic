import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // <-- Esto permite que Angular lo registre automáticamente
})
export class PlaylistService {
  private playlists: any[] = [];

  constructor() {}

  getPlaylists() {
    return this.playlists;
  }

  addSongToPlaylist(playlistName: string, song: any) {
    const playlist = this.playlists.find(p => p.name === playlistName);
    if (playlist) {
      playlist.songs.push(song);
    } else {
      this.playlists.push({ name: playlistName, songs: [song] });
    }
  }
}

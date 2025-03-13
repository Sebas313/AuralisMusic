import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';
import { PlaylistSongsComponent } from '../../components/playlist-songs/playlist-songs.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';

@Component({
  selector: 'app-playlist-user',
  templateUrl: './playlist-user.component.html',
  styleUrls: ['./playlist-user.component.css'],
  standalone: true,
  imports: [CommonModule, PlaylistSongsComponent, MusicPlayerComponent]
})
export class PlaylistUserComponent implements OnInit {
  @Input() playlist: any = null;
  canciones: any[] = [];
  currentSong: any = null;
  showMusicPlayer = false;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.cargarPlaylist(playlistId);
    }
  }

  cargarPlaylist(id: string) {
    this.playlistService.getPlaylist(id).subscribe({
      next: (data) => {
        console.log('📥 Respuesta de la API:', data);

        if (!data || typeof data !== 'object') {
          console.error('❌ Error: Datos de playlist inválidos');
          return;
        }

        this.playlist = data;
        this.canciones = Array.isArray(data.canciones) ? data.canciones : [];
      },
      error: (err) => console.error('❌ Error al cargar la playlist:', err)
    });
  }

  playSong(song: any) {
    if (!song || !song.fileUrl) {
      console.error('❌ La canción no tiene URL de audio');
      return;
    }

    this.currentSong = song;
    this.showMusicPlayer = true;

    // ✅ Enviar la canción al servicio para que `MusicPlayerComponent` la reciba
    this.songService.setCurrentSong(song);
  }
}

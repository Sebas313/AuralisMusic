import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';
import { RandomSongListComponent } from '../../components/random-song-list/random-song-list.component';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, MusicPlayerComponent, RandomSongListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSong: Cancion | null = null;
  isPlaying: boolean = false;
  showMusicPlayer: boolean = false;
  playlist: Cancion[] = [];

  constructor(private songService: SongService) {}

  
  addToPlaylist(song: Cancion) {
    const exists = this.playlist.some(s => s.fileUrl === song.fileUrl);
    if (!exists) {
      this.playlist.push(song);
    }
  }

  playSong(song: Cancion) {
    this.currentSong = song;
    this.isPlaying = true;
    this.showMusicPlayer = true;
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
    this.addToPlaylist(song);
  }

  
  pauseSong() {
    this.isPlaying = false;
    this.songService.setIsPlaying(false);
  }

  
  onSongSelected(song: Cancion) {
    this.playSong(song);
  }
}

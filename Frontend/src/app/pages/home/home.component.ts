import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

import { MusicPlayerComponent } from '../../components/music-player/music-player.component';
import { SongService } from '../../services/song.service';
import { RandomSongListComponent } from '../../components/random-song-list/random-song-list.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SidebarComponent, CommonModule, MusicPlayerComponent,  RandomSongListComponent ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSong: any = null; 
  isPlaying: boolean = false; 
  showMusicPlayer: boolean = false; 
  playlist: any[] = []; 
  songs = [];


 
  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  playSong(song: any) {
    this.currentSong = song;
    this.isPlaying = true;
    this.showMusicPlayer = true; 
  }

 
  pauseSong() {
    this.isPlaying = false;
    this.showMusicPlayer = false;  
  }

  
  onSongSelected(song: any) {
    this.currentSong = song;
    this.isPlaying = true;
    this.showMusicPlayer = true; 
  
    if (!this.playlist.some(s => s.audioUrl === song.audioUrl)) {
      this.playlist.push(song);
    }
  }
}  
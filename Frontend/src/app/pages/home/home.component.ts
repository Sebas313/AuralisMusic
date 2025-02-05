import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SongListComponent } from '../../components/song-list/song-list.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';


@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SidebarComponent, SongListComponent, CommonModule, MusicPlayerComponent,],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSong: any = null; 
  isPlaying: boolean = false; 
  showMusicPlayer: boolean = false; 
  playlist: any[] = []; 
  songs = [
    { title: 'Hotline Bling', artist: 'Drake', image: 'assets/song1.jpg', audioUrl: 'assets/song1.mp3' },
    { title: 'Clocks', artist: 'Coldplay', image: 'assets/song2.jpg', audioUrl: 'assets/song2.mp3' },
    { title: 'Shape of You', artist: 'Ed Sheeran', image: 'assets/song3.jpg', audioUrl: 'assets/song3.mp3' }
  ];


 
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
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-song-list',
  standalone: true,
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
  imports: [CommonModule,]  
})
export class SongListComponent {
  @Output() songSelected = new EventEmitter<any>();
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
  selectSong(song: any) {
    this.songSelected.emit(song);
  }
}
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-list',
  standalone: true,
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
  imports: [CommonModule]
})
export class SongListComponent {
  @Input() songs: any[] = []; // Ahora recibirá las canciones desde el padre
  @Output() songSelected = new EventEmitter<any>();
  playlist: any[] = [];

  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  selectSong(song: any) {
    this.songSelected.emit(song);
  }
}

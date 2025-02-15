import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-random-song-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './random-song-list.component.html',
  styleUrls: ['./random-song-list.component.css']
})
export class RandomSongListComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  currentSong: any = null;
  isPlaying = false;
  playlist: any[] = [];
  songs: any[] = [];

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getSongs().subscribe({
      next: (data) => {
        this.songs = data;
      },
      error: (err) => {
        console.error('Error al obtener canciones:', err);
      }
    });
  }

  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  playSong(song: any) {
    this.currentSong = song;
    this.isPlaying = true;
    this.songSelected.emit(song);
  }
}

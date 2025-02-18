import { Component, EventEmitter, Output, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SongService } from '../../services/song.service'; // Asegúrate de importar correctamente el servicio
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Agregar HttpClientModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  isExpanded = false;
  isSearchVisible = false;
  searchQuery = '';
  currentSong: any = null;
  isPlaying = false;
  playlist: any[] = [];
  songs: any[] = [];
  filteredSongs: any[] = [];
  sound: Howl | null = null;

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getSongs().subscribe(
      (data) => {
        this.songs = data;
        this.filteredSongs = [...this.songs]; // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error al obtener las canciones:', error);
      }
    );
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  filterSongs(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredSongs = this.songs; 
      return;
    }

    this.filteredSongs = this.songs.filter(song => 
      song.cancion?.toLowerCase().includes(searchTerm)
    );
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchQuery = '';
      this.filteredSongs = [...this.songs];
    }
  }

  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  playSong(song: any) {
    if (this.sound) {
      this.sound.stop();
    }

    this.sound = new Howl({
      src: [song.audioUrl],
      html5: true,
      onend: () => {
        this.isPlaying = false;
      }
    });

    this.sound.play();
    this.isPlaying = true;
    this.songSelected.emit(song);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const searchBar = document.querySelector('.search-bar');
    const songList = document.querySelector('.song-list');

    if (sidebar && !sidebar.contains(event.target as Node) && searchBar && !searchBar.contains(event.target as Node) && songList && !songList.contains(event.target as Node)) {
      this.isSearchVisible = false;
    }
  }
}

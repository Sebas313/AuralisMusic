import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  isExpanded = false;
  isSearchVisible = true; // Inicia visible
  isScrolled = false; // 🔥 Nuevo estado para saber si hizo scroll
  searchQuery = '';
  playlist: any[] = [];
  songs: any[] = [];
  filteredSongs: any[] = [];
  currentSong: any = null;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const searchBar = document.querySelector('.search-bar');
    const songList = document.querySelector('.song-list');
  
    if (searchBar && songList && !searchBar.contains(event.target as Node) && !songList.contains(event.target as Node)) {
      this.isSearchVisible = false;
      this.searchQuery = '';
      this.filteredSongs = [...this.songs];
    }
  }
  
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    this.songService.getCanciones().subscribe(
      data => {
        this.songs = data;
        this.filteredSongs = [...this.songs];
      },
      error => {
        console.error('Error al obtener canciones:', error);
      }
    );
  }

  filterSongs(): void {
    const searchTermLower = this.searchQuery.toLowerCase().trim();
    
    if (!searchTermLower) {
      this.filteredSongs = [...this.songs];
    } else {
      this.filteredSongs = this.songs.filter(song =>
        song.cancion?.toLowerCase().includes(searchTermLower) || 
        song.album?.toLowerCase().includes(searchTermLower)
      );
    }
  }

  playSong(song: any) {
    this.currentSong = song;
    this.songSelected.emit(song);
  }

  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  // 🔥 Detectar scroll en la página
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 50; // Si baja más de 50px, cambia el estado
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchQuery = '';
      this.filteredSongs = [...this.songs];
    }
  }
}


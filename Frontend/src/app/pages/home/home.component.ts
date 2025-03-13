import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';
import { RandomSongListComponent } from '../../components/random-song-list/random-song-list.component';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';
import { ArtistInfoComponent } from "../../components/artist-info/artist-info.component";
import { MostPlayedSongsComponent } from "../../components/most-played-songs/most-played-songs.component";
import { RecentSongsComponent } from "../../components/recent-songs/recent-songs.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    MusicPlayerComponent,
    RandomSongListComponent,
    ArtistInfoComponent,
    MostPlayedSongsComponent, // ✅ Se agregó el componente de canciones más escuchadas
    RecentSongsComponent // ✅ Se agregó el componente de canciones más recientes
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSong: Cancion | null = null;
  isPlaying: boolean = false;
  showMusicPlayer: boolean = false;
  playlist: Cancion[] = [];
  selectedArtist: { nombre: string; avatar: string } | null = null;
  mostPlayedSongs: Cancion[] = []; // ✅ Se agregan las listas de canciones
  recentSongs: Cancion[] = [];

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.fetchMostPlayedSongs();
    this.fetchRecentSongs();
  }

  fetchMostPlayedSongs() {
    this.songService.getMostPlayedSongs().subscribe((songs) => {
      this.mostPlayedSongs = songs;
    });
  }

  fetchRecentSongs() {
    this.songService.getRecentSongs().subscribe((songs) => {
      this.recentSongs = songs;
    });
  }

  addToPlaylist(song: Cancion) {
    const exists = this.playlist.some(s => s.fileUrl === song.fileUrl);
    if (!exists) {
      this.playlist.push(song);
    }
  }
  playRandomSong() {
    const allSongs = [...this.mostPlayedSongs, ...this.recentSongs];
    if (allSongs.length === 0) {
      console.error('No hay canciones disponibles para reproducción aleatoria.');
      return;
    }
  
    let randomSong: Cancion;
    do {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      randomSong = allSongs[randomIndex];
    } while (randomSong === this.currentSong && allSongs.length > 1); // Evita repetir
  
    if (!this.playlist.some(s => s._id === randomSong._id)) { // 🔄 Previene duplicados
      this.playlist.push(randomSong);
    }
  
    this.playSong(randomSong);
  }
  
  
  
  
  
  playSong(song: Cancion) {
    if (!song) return;
    this.currentSong = song;
    this.isPlaying = true;
    this.showMusicPlayer = true;
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
    

    this.selectedArtist = song.cantante
      ? {
          nombre: song.cantante.nombre,
          avatar: (song.cantante as any).imagen || 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp'
        }
      : { 
          nombre: 'Artista Desconocido', 
          avatar: 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp'
        };
  }

  pauseSong() {
    this.isPlaying = false;
    this.songService.setIsPlaying(false);
  }

  onSongSelected(song: Cancion) {
    this.playSong(song);
  }

  get avatarUrl(): string {
    return this.selectedArtist?.avatar || 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';
  }
}

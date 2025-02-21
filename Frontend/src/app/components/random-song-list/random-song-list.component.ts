import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { Howl } from 'howler';

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
  sound!: Howl;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}
  
  
  ngOnInit() {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getCanciones().subscribe({
      next: (data) => {
        // Comprobamos si cada canción tiene la URL del audio
        this.songs = data.map(song => {
          if (!song.audioUrl) {
            console.error('Canción sin URL de audio:', song);
            return null;  // Si no tiene audioUrl, no la incluimos
          }
          return {
            ...song,
            audioUrl: song.audioUrl // Aseguramos que cada canción tenga la URL de audio
          };
        }).filter(song => song !== null); // Filtramos las canciones que no tienen audioUrl
      },
      error: (err) => {
        console.error('Error al obtener canciones:', err);
      }
    });
  }
  

  addToPlaylist(song: any) {
    const user = JSON.parse(localStorage.getItem('user') || 'null'); // Asegura que se obtenga como objeto
  
 if (!user || !user._id) {
      alert('Por favor, inicie sesión para agregar canciones a una playlist.');
      return;
    } 
  
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        if (playlists.length > 0) {
          const playlistName = prompt('¿A qué playlist deseas agregar esta canción?');
          const selectedPlaylist = playlists.find(
            (playlist) => playlist.name === playlistName
          );
  
          if (selectedPlaylist) {
            this.playlistService.addSongToPlaylist(selectedPlaylist.id, song).subscribe({
              next: () => alert('🎵 Canción agregada con éxito a la playlist'),
              error: (err) => console.error('❌ Error al agregar canción:', err)
            });
          } else {
            alert('⚠️ No encontré esa playlist.');
          }
        } else {
          const createNewPlaylist = confirm('No tienes playlists. ¿Quieres crear una nueva?');
          if (createNewPlaylist) {
            const newPlaylistName = prompt('Escribe el nombre de la nueva playlist');
            if (newPlaylistName) {
              const newPlaylist = {
                nombre: newPlaylistName,
                creadoPor: user._id, // Asocia la playlist al usuario
                canciones: [song._id]
              };
              console.log('👤 Usuario ID:', user?._id);
              console.log('📂 Enviando Playlist:', newPlaylist);
              this.playlistService.createPlaylist(newPlaylist).subscribe({
                next: (createdPlaylist) => {
                  alert('✅ Playlist creada con éxito y canción añadida');
                },
                error: (err) => console.error('❌ Error al crear la playlist:', err)
              });
            } else {
              alert('⚠️ Debes proporcionar un nombre para la playlist.');
            }
          }
        }
      },
      error: (err) => console.error('❌ Error al obtener playlists:', err)
    });
  }
  

  playSong(song: any) {
    if (this.sound) {
      this.sound.stop(); // Detenemos cualquier canción que esté sonando
    }
  
    // Verificamos que la URL esté presente y válida
    if (!song.audioUrl) {
      console.error('La canción no tiene URL de audio');
      return;
    }
  
    // Creamos una nueva instancia de Howl para reproducir la canción
    this.sound = new Howl({
      src: [song.audioUrl],  // Usamos la URL de la canción
      html5: true, // Usamos HTML5 para una mejor compatibilidad con los archivos grandes
      onloaderror: (id, error) => {
        console.error('Error al cargar la canción:', error);
      },
      onend: () => {
        console.log('Canción terminada');
        this.isPlaying = false;  // Establecemos que no está reproduciéndose
      }
    });
  
    // Reproducimos la canción
    this.sound.play();
    this.currentSong = song;
    this.isPlaying = true;
    this.songSelected.emit(song);  // Emitimos el evento de canción seleccionada (si es necesario)
  }

  pauseSong() {
    if (this.sound) {
      this.sound.pause();  // Pausamos la canción
      this.isPlaying = false;
    }
  }
}

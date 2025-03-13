import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../models/cancion.model';

@Component({
  selector: 'app-recent-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-songs.component.html',
  styleUrls: ['./recent-songs.component.css']
})
export class RecentSongsComponent {
  @Input() songs: Cancion[] = [];
}

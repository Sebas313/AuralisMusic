import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { PlaylistComponent } from '../../components/playlist/playlist.component';

@Component({
  selector: 'app-playlst',
  templateUrl: './playlst.component.html',
  styleUrls: ['./playlst.component.css'],
  imports: [CommonModule, HeaderComponent,PlaylistComponent]
})
  export class Playlst {
}

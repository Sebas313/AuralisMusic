import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ArtistInfoComponent {
  @Input() name: string = 'Desconocido';
  @Input() image: string | null = null;
  @Input() bio: string = 'No hay biografía disponible';

  get avatarUrl(): string {
    return this.image?.trim() ? this.image : 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';
  }
  
}

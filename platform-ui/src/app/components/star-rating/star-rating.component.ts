import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, 
    selector: 'app-star-rating',
    imports: [CommonModule], // Import CommonModule here for *ngFor
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;

  get stars(): number {
    return Math.floor(this.rating);
  }
}
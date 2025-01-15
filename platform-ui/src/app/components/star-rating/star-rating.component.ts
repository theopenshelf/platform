import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  @Input() rating: number = 0;

  get stars(): number {
    return Math.floor(this.rating);
  }
}

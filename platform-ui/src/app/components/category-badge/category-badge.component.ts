import { Component, Input } from '@angular/core';
import { UICategory } from '../../portal/admin/services/categories.service';

@Component({
  standalone: true,
  selector: 'category-badge',
  imports: [],
  templateUrl: './category-badge.component.html',
  styleUrl: './category-badge.component.scss',
})
export class CategoryBadgeComponent {
  @Input() category!: UICategory;
}

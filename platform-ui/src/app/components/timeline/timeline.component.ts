import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';


export interface TimelineItem {
  label: string;
  active?: boolean;
  position: 'left' | 'right';
  dotColor: 'accent' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  lineColor: 'accent' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  lastItem: boolean;
  items: any[];
}

@Component({
  selector: 'timeline',
  imports: [
    CommonModule,
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  @ContentChild('itemTemplate', { read: TemplateRef })
  itemTemplate!: TemplateRef<any>;
  public timelineItems = input.required<TimelineItem[]>();
}

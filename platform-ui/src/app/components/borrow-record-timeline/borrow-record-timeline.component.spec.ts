import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowRecordTimelineComponent } from './borrow-record-timeline.component';

describe('BorrowRecordTimelineComponent', () => {
  let component: BorrowRecordTimelineComponent;
  let fixture: ComponentFixture<BorrowRecordTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowRecordTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowRecordTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

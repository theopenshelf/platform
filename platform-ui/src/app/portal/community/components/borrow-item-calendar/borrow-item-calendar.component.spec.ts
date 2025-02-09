import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowItemCalendarComponent } from './borrow-item-calendar.component';

describe('BorrowItemCalendarComponent', () => {
  let component: BorrowItemCalendarComponent;
  let fixture: ComponentFixture<BorrowItemCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowItemCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowItemCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

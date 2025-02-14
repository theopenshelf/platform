import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowUserCardComponent } from './borrow-record-card.component';

describe('BorrowUserCardComponent', () => {
  let component: BorrowUserCardComponent;
  let fixture: ComponentFixture<BorrowUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowUserCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BorrowUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

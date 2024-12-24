import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowItemCardComponent } from './borrow-item-card.component';

describe('BorrowItemCardComponent', () => {
  let component: BorrowItemCardComponent;
  let fixture: ComponentFixture<BorrowItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowItemCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowsStatComponent } from './borrows-stat.component';

describe('BorrowsStatComponent', () => {
  let component: BorrowsStatComponent;
  let fixture: ComponentFixture<BorrowsStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowsStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowsStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

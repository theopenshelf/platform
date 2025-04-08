import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryBorrowRecordsComponent } from './library-borrow-records.component';

describe('LibraryBorrowRecordsComponent', () => {
  let component: LibraryBorrowRecordsComponent;
  let fixture: ComponentFixture<LibraryBorrowRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryBorrowRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryBorrowRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

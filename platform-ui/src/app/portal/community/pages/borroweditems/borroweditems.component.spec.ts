import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedItemsComponent } from './borroweditems.component';

describe('BorroweditemsComponent', () => {
  let component: BorrowedItemsComponent;
  let fixture: ComponentFixture<BorrowedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowedItemsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BorrowedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

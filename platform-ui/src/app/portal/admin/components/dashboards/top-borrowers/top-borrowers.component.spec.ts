import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBorrowersComponent } from './top-borrowers.component';

describe('TopBorrowersComponent', () => {
  let component: TopBorrowersComponent;
  let fixture: ComponentFixture<TopBorrowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBorrowersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBorrowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

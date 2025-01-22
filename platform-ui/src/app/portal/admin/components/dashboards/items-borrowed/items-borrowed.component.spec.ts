import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsBorrowedComponent } from './items-borrowed.component';

describe('ItemsBorrowedComponent', () => {
  let component: ItemsBorrowedComponent;
  let fixture: ComponentFixture<ItemsBorrowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsBorrowedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

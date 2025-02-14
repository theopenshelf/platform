import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredAndPaginatedItemsComponent } from './filtered-and-paginated-items.component';

describe('FilteredAndPaginatedItemsComponent', () => {
  let component: FilteredAndPaginatedItemsComponent;
  let fixture: ComponentFixture<FilteredAndPaginatedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredAndPaginatedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredAndPaginatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

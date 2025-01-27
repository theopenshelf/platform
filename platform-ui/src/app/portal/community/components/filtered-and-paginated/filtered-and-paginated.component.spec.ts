import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredAndPaginatedComponent } from './filtered-and-paginated.component';

describe('FilteredAndPaginatedComponent', () => {
  let component: FilteredAndPaginatedComponent;
  let fixture: ComponentFixture<FilteredAndPaginatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredAndPaginatedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilteredAndPaginatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

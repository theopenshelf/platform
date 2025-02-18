import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilteredAndPaginatedMembersComponent } from './filtered-and-paginated-members.component';


describe('FilteredAndPaginatedMembersComponent', () => {
  let component: FilteredAndPaginatedMembersComponent;
  let fixture: ComponentFixture<FilteredAndPaginatedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredAndPaginatedMembersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilteredAndPaginatedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

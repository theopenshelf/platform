import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryItemsComponent } from './library-items.component';

describe('LibraryItemsComponent', () => {
  let component: LibraryItemsComponent;
  let fixture: ComponentFixture<LibraryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

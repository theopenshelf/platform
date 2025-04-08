import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryApprovalComponent } from './library-approval.component';

describe('LibraryApprovalComponent', () => {
  let component: LibraryApprovalComponent;
  let fixture: ComponentFixture<LibraryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

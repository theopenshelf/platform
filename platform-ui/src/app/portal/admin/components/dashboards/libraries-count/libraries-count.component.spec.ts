import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesCountComponent } from './libraries-count.component';

describe('LibrariesCountComponent', () => {
  let component: LibrariesCountComponent;
  let fixture: ComponentFixture<LibrariesCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrariesCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

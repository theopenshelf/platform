import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrariesComponent } from './libraries.component';

describe('LibrariesComponent', () => {
  let component: LibrariesComponent;
  let fixture: ComponentFixture<LibrariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrariesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

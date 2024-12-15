import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLibrariesComponent } from './my-libraries.component';

describe('MyLibrariesComponent', () => {
  let component: MyLibrariesComponent;
  let fixture: ComponentFixture<MyLibrariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLibrariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

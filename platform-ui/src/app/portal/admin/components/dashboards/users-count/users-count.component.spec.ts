import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCountComponent } from './users-count.component';

describe('UsersCountComponent', () => {
  let component: UsersCountComponent;
  let fixture: ComponentFixture<UsersCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

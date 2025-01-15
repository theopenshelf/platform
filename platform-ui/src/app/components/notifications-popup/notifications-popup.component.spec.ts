import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPopupComponent } from './notifications-popup.component';

describe('NotificationsPopupComponent', () => {
  let component: NotificationsPopupComponent;
  let fixture: ComponentFixture<NotificationsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

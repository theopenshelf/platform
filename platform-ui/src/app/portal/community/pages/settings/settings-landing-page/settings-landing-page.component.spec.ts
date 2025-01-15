import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLandingPageComponent } from './settings-landing-page.component';

describe('SettingsLandingPageComponent', () => {
  let component: SettingsLandingPageComponent;
  let fixture: ComponentFixture<SettingsLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsLandingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

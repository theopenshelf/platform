import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLandingPageComponent } from './community-landing-page.component';

describe('CommunityLandingPageComponent', () => {
  let component: CommunityLandingPageComponent;
  let fixture: ComponentFixture<CommunityLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

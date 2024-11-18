import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLandingPageComponent } from './public-landing-page.component';

describe('PublicLandingPageComponent', () => {
  let component: PublicLandingPageComponent;
  let fixture: ComponentFixture<PublicLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

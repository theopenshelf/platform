import { ComponentFixture, TestBed } from '@angular/core/testing';

import CommunityLayoutComponent from './community-layout.component';

describe('CommunityLandingPageComponent', () => {
  let component: CommunityLayoutComponent;
  let fixture: ComponentFixture<CommunityLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

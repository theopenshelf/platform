import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPagesComponent } from './community-pages.component';

describe('CommunityPagesComponent', () => {
  let component: CommunityPagesComponent;
  let fixture: ComponentFixture<CommunityPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

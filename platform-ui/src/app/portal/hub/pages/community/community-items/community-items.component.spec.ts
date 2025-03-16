import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityItemsComponent } from './community-items.component';

describe('CommunityItemsComponent', () => {
  let component: CommunityItemsComponent;
  let fixture: ComponentFixture<CommunityItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

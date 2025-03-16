import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLibrariesComponent } from './community-libraries.component';

describe('CommunityLibrariesComponent', () => {
  let component: CommunityLibrariesComponent;
  let fixture: ComponentFixture<CommunityLibrariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityLibrariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

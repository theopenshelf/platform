import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDashboardComponent } from './approval-dashboard.component';

describe('ApprovalDashboardComponent', () => {
  let component: ApprovalDashboardComponent;
  let fixture: ComponentFixture<ApprovalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TosBreadcrumbsComponent } from './tos-breadcrumbs.component';

describe('TosBreadcrumbsComponent', () => {
  let component: TosBreadcrumbsComponent;
  let fixture: ComponentFixture<TosBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TosBreadcrumbsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TosBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPagesComponent } from './custom-pages.component';

describe('CustomPagesComponent', () => {
  let component: CustomPagesComponent;
  let fixture: ComponentFixture<CustomPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

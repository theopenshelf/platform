import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPagesEditComponent } from './custom-pages-edit.component';

describe('CustomPagesEditComponent', () => {
  let component: CustomPagesEditComponent;
  let fixture: ComponentFixture<CustomPagesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPagesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPagesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

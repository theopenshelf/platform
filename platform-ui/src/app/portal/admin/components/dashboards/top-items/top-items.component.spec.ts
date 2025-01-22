import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopItemsComponent } from './top-items.component';

describe('TopItemsComponent', () => {
  let component: TopItemsComponent;
  let fixture: ComponentFixture<TopItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

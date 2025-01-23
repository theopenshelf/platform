import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemActivityComponent } from './item-activity.component';

describe('ItemActivityComponent', () => {
  let component: ItemActivityComponent;
  let fixture: ComponentFixture<ItemActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

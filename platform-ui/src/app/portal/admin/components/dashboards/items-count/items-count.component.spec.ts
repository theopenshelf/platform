import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCountComponent } from './items-count.component';

describe('ItemsCountComponent', () => {
  let component: ItemsCountComponent;
  let fixture: ComponentFixture<ItemsCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

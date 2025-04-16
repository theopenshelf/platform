import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishItemsComponent } from './unpublish-items.component';

describe('UnpublishItemsComponent', () => {
  let component: UnpublishItemsComponent;
  let fixture: ComponentFixture<UnpublishItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpublishItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpublishItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

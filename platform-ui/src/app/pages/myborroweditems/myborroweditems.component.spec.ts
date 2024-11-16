import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyborroweditemsComponent } from './myborroweditems.component';

describe('MyborroweditemsComponent', () => {
  let component: MyborroweditemsComponent;
  let fixture: ComponentFixture<MyborroweditemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyborroweditemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyborroweditemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTopComponent } from './card-top.component';

describe('CardTopComponent', () => {
  let component: CardTopComponent;
  let fixture: ComponentFixture<CardTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

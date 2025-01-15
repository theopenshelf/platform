import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TosTableComponent } from './tos-table.component';

describe('TosTableComponent', () => {
  let component: TosTableComponent;
  let fixture: ComponentFixture<TosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TosTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

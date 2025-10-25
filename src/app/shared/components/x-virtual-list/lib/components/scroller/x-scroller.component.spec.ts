import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XScrollerComponent } from './x-scroller.component';

describe('XScrollerComponent', () => {
  let component: XScrollerComponent;
  let fixture: ComponentFixture<XScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XScrollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XScrollBarComponent } from './x-scroll-bar.component';

describe('XScrollBarComponent', () => {
  let component: XScrollBarComponent;
  let fixture: ComponentFixture<XScrollBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XScrollBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XScrollBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

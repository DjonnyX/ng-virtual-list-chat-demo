import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesWritingIndicatorComponent } from './messages-writing-indicator.component';

describe('MessagesWritingIndicatorComponent', () => {
  let component: MessagesWritingIndicatorComponent;
  let fixture: ComponentFixture<MessagesWritingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesWritingIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesWritingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

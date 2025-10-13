import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSubstrateComponent } from './button-substrate.component';

describe('ButtonSubstrateComponent', () => {
  let component: ButtonSubstrateComponent;
  let fixture: ComponentFixture<ButtonSubstrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSubstrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonSubstrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

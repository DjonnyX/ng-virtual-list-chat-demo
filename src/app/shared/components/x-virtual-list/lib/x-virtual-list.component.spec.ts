import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XVirtualListComponent } from './x-virtual-list.component';

describe('NgVirtualListComponent', () => {
  let component: XVirtualListComponent;
  let fixture: ComponentFixture<XVirtualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XVirtualListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(XVirtualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

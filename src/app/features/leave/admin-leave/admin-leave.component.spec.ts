import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveComponent } from './admin-leave.component';

describe('AdminLeaveComponent', () => {
  let component: AdminLeaveComponent;
  let fixture: ComponentFixture<AdminLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

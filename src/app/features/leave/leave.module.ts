import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LeaveRoutingModule } from './leave-routing.module';
import { AdminLeaveComponent } from './admin-leave/admin-leave.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';


@NgModule({
  declarations: [
    AdminLeaveComponent,
    EmployeeLeaveComponent
  ],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    ReactiveFormsModule
  ]
})
export class LeaveModule { }

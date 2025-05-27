import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLeaveComponent } from './admin-leave/admin-leave.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';

const routes: Routes = [
  {
    path: 'leave-requests',
    component: AdminLeaveComponent
  },
  {
    path: 'my-leaves',
    component: EmployeeLeaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }

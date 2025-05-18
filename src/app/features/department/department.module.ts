import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { DepartmentService } from './services/department.service';

const routes: Routes = [
  {
    path: '',
    component: DepartmentListComponent
  },
  {
    path: 'create',
    component: DepartmentFormComponent
  },
  {
    path: 'edit/:id',
    component: DepartmentFormComponent
  }
];

@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DepartmentService
  ]
})
export class DepartmentModule { }

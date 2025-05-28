import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { DepartmentService } from './services/department.service';
import { DepartmentRoutingModule } from './department-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DepartmentRoutingModule,
    SharedModule
  ],
  providers: [
    DepartmentService
  ]
})
export class DepartmentModule { }

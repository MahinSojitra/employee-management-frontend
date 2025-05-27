import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DepartmentListComponent } from "./components/department-list/department-list.component";
import { DepartmentFormComponent } from "./components/department-form/department-form.component";

const routes: Routes = [
  { path: '', component: DepartmentListComponent },
  { path: 'create', component: DepartmentFormComponent },
  { path: 'edit/:id', component: DepartmentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule {}

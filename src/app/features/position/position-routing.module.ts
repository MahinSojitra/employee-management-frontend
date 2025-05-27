import { RouterModule, Routes } from "@angular/router";
import { PositionListComponent } from "./components/position-list/position-list.component";
import { PositionFormComponent } from "./components/position-form/position-form.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: '', component: PositionListComponent },
  { path: 'create', component: PositionFormComponent },
  { path: 'edit/:id', component: PositionFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule {}

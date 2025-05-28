import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PositionListComponent } from './components/position-list/position-list.component';
import { PositionFormComponent } from './components/position-form/position-form.component';
import { PositionService } from './services/position.service';
import { PositionRoutingModule } from './position-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: PositionListComponent },
  { path: 'create', component: PositionFormComponent },
  { path: 'edit/:id', component: PositionFormComponent }
];

@NgModule({
  declarations: [
    PositionListComponent,
    PositionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PositionRoutingModule,
    SharedModule
  ],
  providers: [
    PositionService
  ]
})
export class PositionModule { }

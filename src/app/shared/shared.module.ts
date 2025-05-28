import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';

@NgModule({
  declarations: [
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DeleteConfirmationComponent
  ]
})
export class SharedModule { }

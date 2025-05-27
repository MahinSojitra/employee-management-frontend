import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AccountService } from './services/account.service';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }

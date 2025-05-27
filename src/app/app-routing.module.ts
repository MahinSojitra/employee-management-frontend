import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';

const routes: Routes = [
  // Public Routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  // Protected Routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        data: { roles: ['Admin', 'Employee'] }
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule),
        data: { roles: ['Admin'] }
      },
      {
        path: 'departments',
        loadChildren: () => import('./features/department/department.module').then(m => m.DepartmentModule),
        data: { roles: ['Admin'] }
      },
      {
        path: 'positions',
        loadChildren: () => import('./features/position/position.module').then(m => m.PositionModule),
        data: { roles: ['Admin'] }
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule),
        data: { roles: ['Admin', 'Employee'] }
      },
      {
        path: 'leaves',
        loadChildren: () => import('./features/leave/leave.module').then(m => m.LeaveModule),
        data: { roles: ['Admin', 'Employee'] }
      }
    ]
  },
  // Redirect to home if no route matches
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

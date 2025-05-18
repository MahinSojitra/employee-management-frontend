import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <h1 class="display-4 text-danger mb-4">Access Denied</h1>
          <p class="lead">You don't have permission to access this page.</p>
          <button class="btn btn-success">Return to Home</button>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}

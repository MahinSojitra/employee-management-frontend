import { delay, of, switchMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginResponse } from 'src/app/core/models/auth.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Getters for cleaner template access & logic
  get email(): AbstractControl {
    return this.signinForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.signinForm.get('password')!;
  }

  private getErrorMessage(error: any): string {
    if (error?.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error?.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error?.status === 500) {
      return 'Something went wrong on our end. Please try again later.';
    }
    return 'An error occurred during sign in. Please try again.';
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.errorMessage = null;
      this.isLoading = true;

      // Simulate delay before actual request
      of(null).pipe(
        delay(3000), // 1 second delay for spinner to be visible
        switchMap(() => this.authService.login(this.signinForm.value))
      ).subscribe({
        next: (response: LoginResponse) => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(err);
          console.error('Signin error:', err);
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }
}

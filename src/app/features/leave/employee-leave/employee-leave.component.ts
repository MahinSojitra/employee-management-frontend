import { TokenService } from './../../../core/services/token.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LeaveService } from 'src/app/features/leave/services/leave.service';
import { catchError, delay } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Leave, SingleLeaveResponse, AllLeavesResponse, CreateLeaveRequest } from '../models/leave.model';

function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const controlDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const forbidden = controlDate.getTime() < today.getTime();
    return forbidden ? { pastDate: { value: control.value } } : null;
  };
}

export function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const start = formGroup.get('startDate')?.value;
    const end = formGroup.get('endDate')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
      formGroup.get('endDate')?.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    }

    const endControl = formGroup.get('endDate');
    if (endControl?.hasError('invalidDateRange')) {
      const errors = { ...endControl.errors };
      delete errors['invalidDateRange'];
      endControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };
}

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  employeeLeaves: Leave[] = [];
  errorMessage: string = '';
  employeeEmail!: string;
  isSubmitting: boolean = false;
  loadingLeaves: boolean = true;

  constructor(private fb: FormBuilder, private leaveService: LeaveService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.employeeEmail = this.tokenService.getUser()?.email || '';
    this.initLeaveForm();
    this.getEmployeeLeaves();
  }

  initLeaveForm(): void {
    this.leaveForm = this.fb.group({
      startDate: ['', [Validators.required, pastDateValidator()]],
      endDate: ['', [Validators.required, pastDateValidator()]],
      reason: ['', Validators.required]
    }, { validators: dateRangeValidator() });
  }

  getEmployeeLeaves(): void {
    this.loadingLeaves = true;
    this.leaveService.getLeavesByEmployeeId(this.employeeEmail)
      .pipe(
        delay(500),
        catchError((error): Observable<AllLeavesResponse> => {
          this.errorMessage = 'Error fetching your leaves.';
          console.error('Error fetching employee leaves:', error);
          return of({ success: false, message: 'Error fetching employee leaves.', data: [] });
        })
      )
      .subscribe((response: AllLeavesResponse) => {
        if (response && response.success && response.data) {
          this.employeeLeaves = response.data;
          this.errorMessage = '';
          this.loadingLeaves = false;
        } else {
          this.employeeLeaves = [];
          this.errorMessage = response.message || 'Failed to fetch your leaves.';
          this.loadingLeaves = false;
        }
      });
  }

  applyForLeave(): void {
    this.leaveForm.get('endDate')?.updateValueAndValidity();

    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const leaveRequest: CreateLeaveRequest = {
      ...this.leaveForm.value,
      employeeEmail: this.employeeEmail
    };

    this.leaveService.createLeave(leaveRequest)
      .pipe(
        catchError((error): Observable<SingleLeaveResponse> => {
          this.errorMessage = 'Error submitting leave request.';
          console.error('Error submitting leave request:', error);
          this.isSubmitting = false;
          return of({ success: false, message: 'Error submitting leave request.', data: {} as Leave });
        })
      )
      .subscribe((response: SingleLeaveResponse) => {
        this.isSubmitting = false;
        if (response && response.success && response.data) {
          this.getEmployeeLeaves();
          this.leaveForm.reset();
          this.leaveForm.markAsPristine();
          this.leaveForm.markAsUntouched();
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Failed to submit leave request.';
        }
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.leaveForm.get(controlName);
    if (controlName === 'startDate' || controlName === 'endDate') {
      if (control?.hasError('required')) return 'Date is required.';
      if (control?.hasError('pastDate')) return 'Past dates are not allowed.';
      if (controlName === 'endDate' && this.leaveForm.errors?.['invalidDateRange']) {
        return 'End date must be after the start date.';
      }
    }
    return '';
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

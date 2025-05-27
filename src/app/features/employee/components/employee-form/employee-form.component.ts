import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../../department/services/department.service';
import { PositionService } from '../../../position/services/position.service';
import { Department } from '../../../department/models/department.model';
import { Position } from '../../../position/models/position.model';

// Custom validator to prevent future dates
function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = new Date(control.value).getTime() > Date.now();
    return forbidden ? { futureDate: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  departments: Department[] = [];
  positions: Position[] = [];
  loadingForm = false;
  isSubmitting = false;
  error: string | null = null;
  isEditMode = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required, pastDateValidator()]],
      hireDate: ['', [Validators.required, pastDateValidator()]],
      employeeType: [1, Validators.required],
      departmentId: ['', Validators.required],
      positionId: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('^\\d{6}$')]]
      })
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadPositions();

    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee();
    }
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load departments';
      }
    });
  }

  loadPositions(): void {
    this.positionService.getPositions().subscribe({
      next: (response) => {
        this.positions = response.data;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load positions';
      }
    });
  }

  loadEmployee(): void {
    if (!this.employeeId) return;

    this.loadingForm = true;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (response) => {
        const employee = response.data;
        const dateOfBirth = employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '';
        const hireDate = employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '';

        Promise.all([
          this.departmentService.getDepartments().toPromise(),
          this.positionService.getPositions().toPromise()
        ]).then(([deptResponse, posResponse]) => {
          if (deptResponse) this.departments = deptResponse.data;
          if (posResponse) this.positions = posResponse.data;

          const department = this.departments.find(d => d.name === employee.departmentName);
          const position = this.positions.find(p => p.title === employee.positionTitle);

          this.employeeForm.patchValue({
            email: employee.email,
            userName: employee.userName,
            firstName: employee.firstName,
            lastName: employee.lastName,
            dateOfBirth: dateOfBirth,
            hireDate: hireDate,
            employeeType: employee.employeeType,
            departmentId: department?.id || '',
            positionId: position?.id || '',
            address: employee.address || null
          });
          this.loadingForm = false;
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load employee';
        this.loadingForm = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;
    this.isSubmitting = true;
    this.error = null;

    const formData = {
      ...this.employeeForm.value,
      employeeType: Number(this.employeeForm.value.employeeType)
    };

    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId!, formData)
      : this.employeeService.createEmployee(formData);
    request.subscribe({
      next: (res) => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.log(error);
        this.error = error.error?.message || 'Failed to save employee';
        this.isSubmitting = false;
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control.hasError('pattern') && controlName === 'address.zipCode') {
      return 'Please enter a valid postal code.';
    }
    if (control.hasError('futureDate')) {
      return 'This date cannot be in the future.';
    }
    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  departmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.departmentId;

    if (this.isEditMode && this.departmentId) {
      this.loadDepartment();
    }
  }

  private loadDepartment(): void {
    this.loading = true;
    this.departmentService.getDepartment(this.departmentId!)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.departmentForm.patchValue(response.data);
          } else {
            this.error = 'Failed to load department';
          }
        },
        error: (err) => {
          this.error = 'An error occurred while loading department';
          console.error('Department loading error:', err);
        }
      });
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const departmentData = this.departmentForm.value;

    const request = this.isEditMode
      ? this.departmentService.updateDepartment(this.departmentId!, departmentData)
      : this.departmentService.createDepartment(departmentData);

    request
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/departments']);
          } else {
            this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} department`;
          }
        },
        error: (err) => {
          this.error = `An error occurred while ${this.isEditMode ? 'updating' : 'creating'} department`;
          console.error('Department operation error:', err);
        }
      });
  }

  get name() {
    return this.departmentForm.get('name');
  }
}

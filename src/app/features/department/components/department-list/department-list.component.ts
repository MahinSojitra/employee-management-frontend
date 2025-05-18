import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  error: string | null = null;

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = null;

    this.departmentService.getDepartments()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.departments = response.data;
          } else {
            this.error = 'Failed to load departments';
          }
        },
        error: (err) => {
          this.error = 'An error occurred while loading departments';
          console.error('Department loading error:', err);
        }
      });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.departments = this.departments.filter(dept => dept.id !== id);
          }
        },
        error: (err) => {
          console.error('Department deletion error:', err);
          alert('Failed to delete department');
        }
      });
    }
  }
}

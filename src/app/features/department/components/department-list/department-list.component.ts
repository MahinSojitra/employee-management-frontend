import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { finalize } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  @ViewChild(DeleteConfirmationComponent) deleteConfirmation!: DeleteConfirmationComponent;

  departments: Department[] = [];
  loading = true;
  error: string | null = null;
  selectedDepartment: Department | null = null;

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

  onDeleteClick(department: Department): void {
    this.selectedDepartment = department;
    this.deleteConfirmation.itemName = department.name;
    this.deleteConfirmation.itemType = 'department';
    this.deleteConfirmation.show();
  }

  onDeleteConfirm(): void {
    if (this.selectedDepartment) {
      this.departmentService.deleteDepartment(this.selectedDepartment.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.departments = this.departments.filter(dept => dept.id !== this.selectedDepartment?.id);
          }
        },
        error: (err) => {
          console.error('Department deletion error:', err);
          this.error = 'Failed to delete department';
        }
      });
    }
  }
}

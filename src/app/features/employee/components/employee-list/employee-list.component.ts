import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeType } from '../../models/employee.model';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  @ViewChild(DeleteConfirmationComponent) deleteConfirmation!: DeleteConfirmationComponent;

  employees: Employee[] = [];
  loading = false;
  error: string | null = null;
  selectedEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;

    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load employees';
        this.loading = false;
      }
    });
  }

  onDeleteClick(employee: Employee): void {
    this.selectedEmployee = employee;
    this.deleteConfirmation.itemName = employee.firstName + ' ' + employee.lastName;
    this.deleteConfirmation.itemType = 'employee';
    this.deleteConfirmation.show();
  }

  onDeleteConfirm(): void {
    if (this.selectedEmployee) {
      this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.id !== this.selectedEmployee?.id);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to delete employee';
        }
      });
    }
  }

  getEmployeeTypeLabel(type: EmployeeType): string {
    switch (type) {
      case EmployeeType.FullTime:
        return 'Full Time';
      case EmployeeType.PartTime:
        return 'Part Time';
      case EmployeeType.Intern:
        return 'Intern';
      case EmployeeType.Contract:
        return 'Contract';
      default:
        return 'Unknown';
    }
  }

  getEmployeeTypeClass(type: EmployeeType): string {
    switch (type) {
      case EmployeeType.FullTime:
        return 'bg-primary';
      case EmployeeType.PartTime:
        return 'bg-info';
      case EmployeeType.Intern:
        return 'bg-warning';
      case EmployeeType.Contract:
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }
}

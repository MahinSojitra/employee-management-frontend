import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeType } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;

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

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.id !== id);
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

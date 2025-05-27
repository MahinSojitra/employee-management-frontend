export interface Department {
  id: string;
  name: string;
  employeeCount?: number;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department[];
}

export interface SingleDepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}

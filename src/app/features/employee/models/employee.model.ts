export enum EmployeeType {
  FullTime = 0,
  PartTime = 1,
  Intern = 2,
  Contract = 3
}

export interface Employee {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  hireDate: string;
  employeeType: EmployeeType;
  departmentId: string;
  positionId: string;
  departmentName: string;
  positionTitle: string;
  address: Address | null;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  employeeId: string;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee[];
}

export interface SingleEmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeFormData {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  hireDate: string;
  employeeType: EmployeeType;
  departmentId: string;
  positionId: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  } | null;
}

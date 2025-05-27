export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  hireDate: string;
  employeeType: string;
  departmentName: string;
  positionTitle: string;
  address: Address;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

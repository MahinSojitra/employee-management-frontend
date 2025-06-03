import { EmployeeFormData } from './employee.model';

export type CreateEmployeeDTO = Omit<EmployeeFormData, 'id'>;

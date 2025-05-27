export interface Leave {
  id?: string;
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status?: string;
}

export interface CreateLeaveRequest {
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface SingleLeaveResponse {
  success: boolean;
  message: string;
  data: Leave;
}

export interface AllLeavesResponse {
  success: boolean;
  message: string;
  data: Leave[];
}

export interface DeleteLeaveResponse {
  success: boolean;
  message: string;
  data: boolean;
}

export interface CreateLeaveRequest extends Omit<Leave, 'id' | 'status'> {}

export interface SimpleSuccessResponse {
  success: boolean;
  message: string;
  data: boolean;
}

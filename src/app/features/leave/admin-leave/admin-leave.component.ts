import { Component, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/features/leave/services/leave.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Leave, AllLeavesResponse, SingleLeaveResponse, SimpleSuccessResponse } from '../models/leave.model';

@Component({
  selector: 'app-admin-leave',
  templateUrl: './admin-leave.component.html',
  styleUrls: ['./admin-leave.component.scss']
})
export class AdminLeaveComponent implements OnInit {
  leaves: Leave[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.getAllLeaves();
  }

  getAllLeaves(): void {
    this.loading = true;
    this.leaveService.getAllLeaves()
      .pipe(
        finalize(() => this.loading = false),
        catchError((error): Observable<AllLeavesResponse> => {
          this.errorMessage = 'Error fetching leaves.';
          console.error('Error fetching leaves:', error);
          return of({ success: false, message: 'Error fetching leaves.', data: [] });
        })
      )
      .subscribe((response: AllLeavesResponse) => {
        if (response && response.success && response.data) {
          this.leaves = response.data;
          this.errorMessage = '';
        } else {
          this.leaves = [];
          this.errorMessage = response.message || 'Failed to fetch leaves.';
        }
      });
  }

  get pendingLeaves(): Leave[] {
    return this.leaves.filter(leave => leave.status === 'Pending');
  }

  approveLeave(leaveId: string): void {
    this.leaveService.approveLeaveRequest(leaveId)
      .pipe(
        catchError((error): Observable<SimpleSuccessResponse> => {
          this.errorMessage = 'Error approving leave.';
          console.error('Error approving leave:', error);
          return of({ success: false, message: 'Error approving leave.', data: false });
        })
      )
      .subscribe((response: SimpleSuccessResponse) => {
        if (response && response.success) {
          // Update the leave status in the local array
          const leaveIndex = this.leaves.findIndex(leave => leave.id === leaveId);
          if (leaveIndex !== -1) {
            this.leaves[leaveIndex].status = 'Approved'; // Assuming status is updated to 'Approved' on success
          }
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Failed to approve leave.';
        }
      });
  }

  rejectLeave(leaveId: string): void {
    this.leaveService.rejectLeaveRequest(leaveId)
      .pipe(
        catchError((error): Observable<SimpleSuccessResponse> => {
          this.errorMessage = 'Error rejecting leave.';
          console.error('Error rejecting leave:', error);
          return of({ success: false, message: 'Error rejecting leave.', data: false });
        })
      )
      .subscribe((response: SimpleSuccessResponse) => {
        if (response && response.success) {
          // Update the leave status in the local array
          const leaveIndex = this.leaves.findIndex(leave => leave.id === leaveId);
          if (leaveIndex !== -1) {
            this.leaves[leaveIndex].status = 'Rejected'; // Assuming status is updated to 'Rejected' on success
          }
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Failed to reject leave.';
        }
      });
  }

  refreshLeaves(): void {
    this.getAllLeaves();
  }

}

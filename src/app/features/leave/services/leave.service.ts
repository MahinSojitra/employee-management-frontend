import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Leave, SingleLeaveResponse, AllLeavesResponse, DeleteLeaveResponse, CreateLeaveRequest, SimpleSuccessResponse } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private readonly API_URL = `${environment.apiBaseUrl}/leave`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getAccessToken()}`
    });
  }

  getAllLeaves(): Observable<AllLeavesResponse> {
    return this.http.get<AllLeavesResponse>(this.API_URL, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createLeave(leaveData: CreateLeaveRequest): Observable<SingleLeaveResponse> {
    return this.http.post<SingleLeaveResponse>(this.API_URL, leaveData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLeaveById(id: string): Observable<SingleLeaveResponse> {
    return this.http.get<SingleLeaveResponse>(`${this.API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLeave(id: string): Observable<DeleteLeaveResponse> {
    return this.http.delete<DeleteLeaveResponse>(`${this.API_URL}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLeavesByEmployeeId(employeeId: string): Observable<AllLeavesResponse> {
    return this.http.get<AllLeavesResponse>(`${this.API_URL}/employee/${employeeId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  approveLeaveRequest(id: string): Observable<SimpleSuccessResponse> {
    return this.http.put<SimpleSuccessResponse>(`${this.API_URL}/approve/${id}`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  rejectLeaveRequest(id: string): Observable<SimpleSuccessResponse> {
    return this.http.put<SimpleSuccessResponse>(`${this.API_URL}/reject/${id}`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    // TODO: Implement more specific error handling based on backend response structure
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EmployeeResponse,
  SingleEmployeeResponse,
  EmployeeFormData,
} from '../models/employee.model';
import { TokenService } from '../../../core/services/token.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly API_URL = `${environment.apiBaseUrl}${environment.employeeUrl}`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
    });
  }

  getEmployees(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.API_URL, {
      headers: this.getHeaders(),
    });
  }

  getEmployee(id: string): Observable<SingleEmployeeResponse> {
    return this.http.get<SingleEmployeeResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createEmployee(
    employee: Omit<EmployeeFormData, 'id'>
  ): Observable<SingleEmployeeResponse> {
    return this.http.post<SingleEmployeeResponse>(this.API_URL, employee, {
      headers: this.getHeaders(),
    });
  }

  updateEmployee(
    employee: EmployeeFormData
  ): Observable<SingleEmployeeResponse> {
    return this.http.put<SingleEmployeeResponse>(this.API_URL, employee, {
      headers: this.getHeaders(),
    });
  }

  deleteEmployee(id: string): Observable<SingleEmployeeResponse> {
    return this.http.delete<SingleEmployeeResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

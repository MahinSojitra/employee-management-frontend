import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Department, DepartmentResponse, SingleDepartmentResponse } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly API_URL = `${environment.apiBaseUrl}${environment.departmentUrl}`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getAccessToken()}`
    });
  }

  getDepartments(): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(this.API_URL, {
      headers: this.getHeaders()
    });
  }

  getDepartment(id: string): Observable<SingleDepartmentResponse> {
    return this.http.get<SingleDepartmentResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createDepartment(department: Omit<Department, 'id'>): Observable<SingleDepartmentResponse> {
    return this.http.post<SingleDepartmentResponse>(this.API_URL, department, {
      headers: this.getHeaders()
    });
  }

  updateDepartment(id: string, department: Omit<Department, 'id'>): Observable<SingleDepartmentResponse> {
    return this.http.put<SingleDepartmentResponse>(`${this.API_URL}/${id}`, department, {
      headers: this.getHeaders()
    });
  }

  deleteDepartment(id: string): Observable<SingleDepartmentResponse> {
    return this.http.delete<SingleDepartmentResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

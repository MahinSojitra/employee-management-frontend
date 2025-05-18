import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Position, PositionResponse, SinglePositionResponse } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly API_URL = `${environment.apiBaseUrl}${environment.positionUrl}`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getAccessToken()}`
    });
  }

  getPositions(): Observable<PositionResponse> {
    return this.http.get<PositionResponse>(this.API_URL, {
      headers: this.getHeaders()
    });
  }

  getPosition(id: string): Observable<SinglePositionResponse> {
    return this.http.get<SinglePositionResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createPosition(position: Omit<Position, 'id'>): Observable<SinglePositionResponse> {
    return this.http.post<SinglePositionResponse>(this.API_URL, position, {
      headers: this.getHeaders()
    });
  }

  updatePosition(id: string, position: Omit<Position, 'id'>): Observable<SinglePositionResponse> {
    return this.http.put<SinglePositionResponse>(`${this.API_URL}/${id}`, position, {
      headers: this.getHeaders()
    });
  }

  deletePosition(id: string): Observable<SinglePositionResponse> {
    return this.http.delete<SinglePositionResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

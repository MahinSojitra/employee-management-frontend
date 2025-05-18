import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { Profile, ProfileResponse } from '../../../core/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly API_URL = `${environment.apiBaseUrl}${environment.profileUrl}`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  getProfile(): Observable<ProfileResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getAccessToken()}`
    });

    return this.http.get<ProfileResponse>(`${this.API_URL}`, { headers });
  }
}

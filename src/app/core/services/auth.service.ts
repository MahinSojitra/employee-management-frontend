import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { LoginRequest, LoginResponse, TokenResponse, User, TokenVerificationResponse } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly loginUrl = environment.signInUrl;
  private readonly logoutUrl = environment.signOutUrl;
  private readonly refreshTokenUrl = environment.refreshTokenUrl;
  private readonly verifyTokenUrl = environment.verifyTokenUrl;

  private authStatusSubject = new BehaviorSubject<boolean>(this.tokenService.isAuthenticated());
  authStatus$ = this.authStatusSubject.asObservable();
  user$ = this.tokenService.user$;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  verifyToken(): Observable<TokenVerificationResponse> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return throwError(() => new Error('No access token available'));
    }
    return this.http.post<{ isValid: TokenVerificationResponse }>(
      `${this.apiUrl}${this.verifyTokenUrl}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response.isValid),
      catchError(this.handleError)
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}${this.loginUrl}`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.tokenService.setUser(response.user);
        this.authStatusSubject.next(true);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}${this.logoutUrl}`, {})
      .pipe(
      tap(() => {
        this.tokenService.clearTokens();
        this.authStatusSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenResponse>(`${this.apiUrl}${this.refreshTokenUrl}`, { refreshToken })
      .pipe(
        tap(response => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
        }),
        catchError(error => {
          this.tokenService.clearTokens();
          this.authStatusSubject.next(false);
          return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  hasRole(role: string): boolean {
    return this.tokenService.hasRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.tokenService.hasAnyRole(roles);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}

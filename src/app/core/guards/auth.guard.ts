import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  take,
  tap
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private lastVerifiedRoute?: string;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private verifyAuth(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    return this.authService.verifyToken().pipe(
      take(1),
      tap(response => {
        if (response.user) {
          this.tokenService.setUser(response.user);
        }
      }),
      switchMap(response => {
        if (!response.valid) {
          return this.authService.refreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.tokenService.clearTokens();
              this.router.navigate(['/auth/signin']);
              return of(false);
            })
          );
        }

        // Role check
        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles && requiredRoles.length > 0) {
          const user = this.tokenService.getUser();
          if (!user || !user.roles.some(role => requiredRoles.includes(role))) {
            this.router.navigate(['/unauthorized']);
            return of(false);
          }
        }

        return of(true);
      }),
      catchError(() => {
        this.tokenService.clearTokens();
        this.router.navigate(['/auth/signin']);
        return of(false);
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.verifyAuth(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Check if we've already verified this route
    if (this.lastVerifiedRoute === state.url) {
      return of(true);
    }

    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    // Update last verified route
    this.lastVerifiedRoute = state.url;

    return this.authService.verifyToken().pipe(
      take(1),
      tap(response => {
        if (response.user) {
          this.tokenService.setUser(response.user);
        }
      }),
      switchMap(response => {
        if (!response.valid) {
          return this.authService.refreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.tokenService.clearTokens();
              this.router.navigate(['/auth/signin']);
              return of(false);
            })
          );
        }

        // Role check
        const requiredRoles = childRoute.data['roles'] as Array<string>;
        if (requiredRoles && requiredRoles.length > 0) {
        const user = this.tokenService.getUser();
        if (!user || !user.roles.some(role => requiredRoles.includes(role))) {
          this.router.navigate(['/unauthorized']);
          return of(false);
          }
        }

        return of(true);
      }),
      catchError(() => {
        this.tokenService.clearTokens();
        this.router.navigate(['/auth/signin']);
        return of(false);
      })
    );
  }
}

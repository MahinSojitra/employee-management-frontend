import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // First check if token exists
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    // Then verify token and roles with the server
    return this.authService.verifyToken().pipe(
      take(1),
      switchMap(response => {
        console.log('Token verification response:', response);
        if (!response.valid) {
          // Try to refresh token if verification fails
          return this.authService.refreshToken().pipe(
            map(() => true),
            catchError(() => {
              this.tokenService.clearTokens();
              this.router.navigate(['/auth/signin']);
              return of(false);
            })
          );
        }

        // Update user data if verification is successful
        if (response.user) {
          this.tokenService.setUser(response.user);
        }

        // Get the first child route if it exists
        const firstChild = route.firstChild;
        // Check for required roles in both parent and child routes
        const requiredRoles = (firstChild?.data['roles'] || route.data['roles']) as Array<string>;
        console.log('Required roles for route:', requiredRoles);

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
          return of(true);
        }

        // Check if user has required roles
        const user = this.tokenService.getUser();
        console.log('Current user:', user);

        if (!user || !user.roles.some(role => requiredRoles.includes(role))) {
          this.router.navigate(['/unauthorized']);
          return of(false);
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

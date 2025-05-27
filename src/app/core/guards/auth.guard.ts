import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // First check if we have a token
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    // Always verify token on route change
    return this.authService.verifyToken().pipe(
      take(1),
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

        if (response.user) {
          this.tokenService.setUser(response.user);
        }

        // Check roles if required
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

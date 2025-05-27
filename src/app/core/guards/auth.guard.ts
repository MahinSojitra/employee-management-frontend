import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, take, switchMap, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  private cancelVerification = new Subject<void>();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    this.cancelVerification.next(); // Cancel any ongoing verification

    return this.authService.verifyToken().pipe(
      debounceTime(1000),
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

        const requiredRoles = childRoute.data['roles'] as Array<string>;
        const user = this.tokenService.getUser();

        if (!requiredRoles || requiredRoles.length === 0) {
          return of(true);
        }

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

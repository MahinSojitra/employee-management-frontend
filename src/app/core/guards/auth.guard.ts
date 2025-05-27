import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of, Subject, BehaviorSubject, timer } from 'rxjs';
import { catchError, map, switchMap, take, shareReplay, filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  private verificationStream$: Observable<boolean>;
  private lastVerificationTime = 0;
  private readonly VERIFICATION_INTERVAL = 30000; // 30 seconds

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Create a shared verification stream
    this.verificationStream$ = new BehaviorSubject<void>(undefined).pipe(
      switchMap(() => {
        const now = Date.now();
        if (now - this.lastVerificationTime < this.VERIFICATION_INTERVAL) {
          return of(true);
        }
        return this.authService.verifyToken().pipe(
          map(response => {
            this.lastVerificationTime = now;
            if (response.user) {
              this.tokenService.setUser(response.user);
            }
            return response.valid;
          }),
          catchError(() => {
            return this.authService.refreshToken().pipe(
              map(() => {
                this.lastVerificationTime = now;
                return true;
              }),
              catchError(() => {
                this.tokenService.clearTokens();
                this.router.navigate(['/auth/signin']);
                return of(false);
              })
            );
          })
        );
      }),
      shareReplay(1)
    );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    return this.verificationStream$.pipe(
      take(1),
      switchMap(isValid => {
        if (!isValid) {
          return of(false);
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
      })
    );
  }
}

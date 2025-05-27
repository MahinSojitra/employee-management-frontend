import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, take, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  private lastVerificationTime = 0;
  private readonly VERIFICATION_INTERVAL = 60000; // 60 seconds
  private verificationTrigger$ = new BehaviorSubject<void>(undefined);
  private verificationStream$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Create a shared verification stream
    this.verificationStream$ = this.verificationTrigger$.pipe(
      switchMap(() => {
        const now = Date.now();
        const timeSinceLastVerification = now - this.lastVerificationTime;

        // If we've verified recently, return the cached result
        if (this.lastVerificationTime !== 0 && timeSinceLastVerification < this.VERIFICATION_INTERVAL) {
          return of(true);
        }

        // Perform new verification
        return this.authService.verifyToken().pipe(
          tap(() => {
            this.lastVerificationTime = now;
          }),
          switchMap(response => {
            if (!response.valid) {
              // If token is invalid, try to refresh
              return this.authService.refreshToken().pipe(
                tap(() => {
                  this.lastVerificationTime = now;
                }),
                map(() => true),
                catchError(() => {
                  this.handleInvalidToken();
                  return of(false);
                })
              );
            }

            if (response.user) {
              this.tokenService.setUser(response.user);
            }
            return of(true);
          }),
          catchError(() => {
            // If verification fails, try to refresh token
            return this.authService.refreshToken().pipe(
              tap(() => {
                this.lastVerificationTime = now;
              }),
              map(() => true),
              catchError(() => {
                this.handleInvalidToken();
                return of(false);
              })
            );
          })
        );
      }),
      shareReplay(1)
    );
  }

  private handleInvalidToken(): void {
    this.tokenService.clearTokens();
    this.lastVerificationTime = 0; // Reset verification time
    this.router.navigate(['/auth/signin']);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.tokenService.getAccessToken()) {
      this.handleInvalidToken();
      return of(false);
    }

    // Force a new verification if needed
    const now = Date.now();
    if (now - this.lastVerificationTime >= this.VERIFICATION_INTERVAL || this.lastVerificationTime === 0) {
      this.verificationTrigger$.next();
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

import { Injectable } from '@angular/core';
import {
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
  shareReplay
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  private verifyToken$?: Observable<any>;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      // Reset cache on every navigation start
      if (event.constructor.name === 'NavigationStart') {
        this.verifyToken$ = undefined;
      }
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!this.tokenService.getAccessToken()) {
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    // Cache verifyToken call per route activation
    if (!this.verifyToken$) {
      this.verifyToken$ = this.authService.verifyToken().pipe(
        take(1),
        shareReplay(1)
      );
    }

    return this.verifyToken$.pipe(
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
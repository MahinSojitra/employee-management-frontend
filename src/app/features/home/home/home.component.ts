import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserResponse } from 'src/app/core/models/user-response.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: UserResponse | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.authStatus$.subscribe(status => {
        this.isLoggedIn = status;
      }),
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }
}

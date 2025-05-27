import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Profile } from '../../models/profile.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  error: string | null = null;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.accountService.getProfile()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response.data);
            this.profile = response.data;
          } else {
            this.error = 'Failed to load profile data';
          }
        },
        error: (err) => {
          this.error = 'An error occurred while loading profile data';
          console.error('Profile loading error:', err);
        }
      });
  }
}

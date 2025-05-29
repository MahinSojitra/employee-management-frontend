import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../../services/position.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})
export class PositionFormComponent implements OnInit {
  positionForm: FormGroup;
  isEditMode = false;
  loading = false;
  isSubmitting = false;
  error: string | null = null;
  positionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private positionService: PositionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.positionForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.positionId;

    if (this.isEditMode && this.positionId) {
      this.loadPosition();
    }
  }

  private loadPosition(): void {
    this.loading = true;
    this.positionService.getPosition(this.positionId!)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.positionForm.patchValue({
              id: response.data.id,
              title: response.data.title,
              description: response.data.description
            });
          } else {
            this.error = 'Failed to load position';
          }
        },
        error: (err) => {
          this.error = 'An error occurred while loading position';
          console.error('Position loading error:', err);
        }
      });
  }

  onSubmit(): void {
    if (this.positionForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const positionData = this.positionForm.value;

    const request = this.isEditMode
      ? this.positionService.updatePosition(positionData)
      : this.positionService.createPosition(positionData);

    request
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/positions']);
          } else {
            this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} position`;
          }
        },
        error: (err) => {
          this.error = `An error occurred while ${this.isEditMode ? 'updating' : 'creating'} position`;
          console.error('Position operation error:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  get title() {
    return this.positionForm.get('title');
  }

  get description() {
    return this.positionForm.get('description');
  }
}

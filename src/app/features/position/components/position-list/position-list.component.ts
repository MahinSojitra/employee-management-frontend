import { Component, OnInit } from '@angular/core';
import { PositionService } from '../../services/position.service';
import { Position } from '../../models/position.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss']
})
export class PositionListComponent implements OnInit {
  positions: Position[] = [];
  loading = true;
  error: string | null = null;

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.loading = true;
    this.error = null;

    this.positionService.getPositions()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.positions = response.data;
          } else {
            this.error = 'Failed to load positions';
          }
        },
        error: (err) => {
          this.error = 'An error occurred while loading positions';
          console.error('Position loading error:', err);
        }
      });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this position?')) {
      this.positionService.deletePosition(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.positions = this.positions.filter(pos => pos.id !== id);
          }
        },
        error: (err) => {
          console.error('Position deletion error:', err);
          alert('Failed to delete position');
        }
      });
    }
  }
}

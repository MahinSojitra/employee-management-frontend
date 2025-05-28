import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionService } from '../../services/position.service';
import { Position } from '../../models/position.model';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss']
})
export class PositionListComponent implements OnInit {
  @ViewChild(DeleteConfirmationComponent) deleteConfirmation!: DeleteConfirmationComponent;

  positions: Position[] = [];
  loading = true;
  error: string | null = null;
  selectedPosition: Position | null = null;

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.loading = true;
    this.error = null;

    this.positionService.getPositions().subscribe({
      next: (response) => {
        if (response.success) {
          this.positions = response.data;
        } else {
          this.error = 'Failed to load positions';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'An error occurred while loading positions';
        console.error('Position loading error:', err);
        this.loading = false;
      }
    });
  }

  onDeleteClick(position: Position): void {
    this.selectedPosition = position;
    this.deleteConfirmation.itemName = position.title;
    this.deleteConfirmation.itemType = 'position';
    this.deleteConfirmation.show();
  }

  onDeleteConfirm(): void {
    if (this.selectedPosition) {
      this.positionService.deletePosition(this.selectedPosition.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.positions = this.positions.filter(pos => pos.id !== this.selectedPosition?.id);
          }
        },
        error: (err) => {
          console.error('Position deletion error:', err);
          this.error = 'Failed to delete position';
        }
      });
    }
  }
}

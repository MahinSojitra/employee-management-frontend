import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html'
})
export class DeleteConfirmationComponent {
  @Input() itemName: string = '';
  @Input() itemType: string = ''; // e.g., 'employee', 'department', 'position'
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private modal: any;

  ngAfterViewInit() {
    // Initialize Bootstrap modal
    this.modal = new (window as any).bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  onConfirm() {
    this.confirm.emit();
    this.hide();
  }

  onCancel() {
    this.cancel.emit();
    this.hide();
  }
}

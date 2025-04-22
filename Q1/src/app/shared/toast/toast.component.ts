import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="toast" 
      class="toast"
      [ngClass]="'toast-' + toast.type"
    >
      {{ toast.message }}
    </div>
  `
})
export class ToastComponent implements OnDestroy {
  toast: Toast | null = null;
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
      
      if (toast) {
        setTimeout(() => {
          this.toast = null;
        }, 3000);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}